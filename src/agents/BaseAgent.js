import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const configPath = path.join(__dirname, '../../config/default.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export class BaseAgent {
  constructor(name, model, apiKey) {
    this.name = name;
    this.model = model;
    this.apiKey = apiKey;
  }

  async execute(prompt, context = {}) {
    throw new Error('execute() must be implemented by subclass');
  }

  formatPrompt(userInput, additionalContext = '') {
    return `${additionalContext}\n\nUser Input: ${JSON.stringify(userInput, null, 2)}`;
  }
}

export class ClaudeAgent extends BaseAgent {
  constructor(name, systemPrompt, modelOverride = null) {
    const modelConfig = config.aiProviders.anthropic;
    super(name, modelOverride || modelConfig.model, process.env.ANTHROPIC_API_KEY);
    this.systemPrompt = systemPrompt;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
    this.maxTokens = modelConfig.maxTokens;
    this.temperature = modelConfig.temperature;
  }

  async execute(userMessage, context = {}) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: this.maxTokens,
          system: this.systemPrompt,
          messages: [{
            role: 'user',
            content: userMessage
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return {
        agent: this.name,
        provider: 'claude',
        content: response.data.content[0].text,
        model: this.model,
        usage: response.data.usage
      };
    } catch (error) {
      console.error(`${this.name} error:`, error.response?.data || error.message);
      throw error;
    }
  }
}

export class GPTAgent extends BaseAgent {
  constructor(name, systemPrompt, modelOverride = null) {
    const modelConfig = config.aiProviders.openai;
    super(name, modelOverride || modelConfig.model, process.env.OPENAI_API_KEY);
    this.systemPrompt = systemPrompt;
    this.maxTokens = modelConfig.maxTokens;
    this.temperature = modelConfig.temperature;
  }

  async execute(userMessage, context = {}) {
    try {
      const { OpenAI } = await import('openai');
      const client = new OpenAI({ apiKey: this.apiKey });
      
      const response = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      });

      return {
        agent: this.name,
        provider: 'openai',
        content: response.choices[0].message.content,
        model: this.model,
        usage: response.usage
      };
    } catch (error) {
      console.error(`${this.name} error:`, error.message);
      throw error;
    }
  }
}

export class CopilotAgent extends BaseAgent {
  constructor(name, systemPrompt, modelOverride = null) {
    const modelConfig = config.aiProviders.copilot;
    super(name, modelOverride || modelConfig.model, process.env.GITHUB_TOKEN);
    this.systemPrompt = systemPrompt;
    this.apiUrl = modelConfig.apiUrl;
    this.maxTokens = modelConfig.maxTokens;
    this.temperature = modelConfig.temperature;
  }

  async execute(userMessage, context = {}) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Editor-Version': 'vscode/1.85.0',
            'Editor-Plugin-Version': 'copilot-chat/0.11.1',
            'User-Agent': 'GitHubCopilotChat/0.11.1'
          }
        }
      );

      return {
        agent: this.name,
        provider: 'copilot',
        content: response.data.choices[0].message.content,
        model: this.model,
        usage: response.data.usage
      };
    } catch (error) {
      console.error(`${this.name} error:`, error.response?.data || error.message);
      throw error;
    }
  }
}

// Factory function to create agents based on configuration
export function createAgent(agentType, name, systemPrompt) {
  // Check environment variable first, then fall back to config file
  const envKey = `${agentType.toUpperCase()}_AGENT`;
  const provider = process.env[envKey] || config.agentAssignments[agentType] || 'claude';
  
  console.log(`🤖 Creating ${name} using ${provider.toUpperCase()}`);
  
  switch (provider.toLowerCase()) {
    case 'openai':
    case 'gpt':
      return new GPTAgent(name, systemPrompt);
    case 'claude':
    case 'anthropic':
      return new ClaudeAgent(name, systemPrompt);
    case 'copilot':
    case 'github':
      return new CopilotAgent(name, systemPrompt);
    default:
      console.warn(`Unknown provider ${provider}, defaulting to Claude`);
      return new ClaudeAgent(name, systemPrompt);
  }
}
