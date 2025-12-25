import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

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
  constructor(name, systemPrompt) {
    super(name, 'claude-3-5-sonnet-20241022', process.env.ANTHROPIC_API_KEY);
    this.client = new Anthropic({ apiKey: this.apiKey });
    this.systemPrompt = systemPrompt;
  }

  async execute(userMessage, context = {}) {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: this.systemPrompt,
        messages: [{
          role: 'user',
          content: userMessage
        }]
      });

      return {
        agent: this.name,
        content: response.content[0].text,
        model: this.model,
        usage: response.usage
      };
    } catch (error) {
      console.error(`${this.name} error:`, error.message);
      throw error;
    }
  }
}

export class GPTAgent extends BaseAgent {
  constructor(name, systemPrompt) {
    super(name, 'gpt-4-turbo-preview', process.env.OPENAI_API_KEY);
    this.systemPrompt = systemPrompt;
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
        temperature: 0.7,
        max_tokens: 4096
      });

      return {
        agent: this.name,
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
