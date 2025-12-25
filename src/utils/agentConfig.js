import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the configured provider for a specific agent
 * Priority: Environment variable > Config file > Default
 */
export function getAgentProvider(agentType) {
  const configPath = path.join(__dirname, '../../config/default.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  const envKey = `${agentType.toUpperCase()}_AGENT`;
  return process.env[envKey] || config.agentAssignments[agentType] || 'claude';
}

/**
 * Display current agent configuration
 */
export function showAgentConfiguration() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║          Current Agent Configuration                 ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  
  const agents = ['orchestrator', 'search', 'priceAnalyzer', 'strategy'];
  const providers = {
    orchestrator: getAgentProvider('orchestrator'),
    search: getAgentProvider('search'),
    priceAnalyzer: getAgentProvider('priceAnalyzer'),
    strategy: getAgentProvider('strategy')
  };
  
  console.log('Agent Roles:');
  console.log(`  🎯 Orchestrator:    ${providers.orchestrator.toUpperCase()}`);
  console.log(`  🔍 Search Agent:    ${providers.search.toUpperCase()}`);
  console.log(`  💰 Price Analyzer:  ${providers.priceAnalyzer.toUpperCase()}`);
  console.log(`  🎲 Strategy Agent:  ${providers.strategy.toUpperCase()}\n`);
  
  console.log('Available API Keys:');
  console.log(`  ✓ OpenAI:    ${process.env.OPENAI_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log(`  ✓ Claude:    ${process.env.ANTHROPIC_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log(`  ✓ Copilot:   ${process.env.GITHUB_TOKEN ? '✓ Configured' : '✗ Missing'}\n`);
  
  return providers;
}

/**
 * Validate that required API keys are available
 */
export function validateAPIKeys() {
  const providers = {
    orchestrator: getAgentProvider('orchestrator'),
    search: getAgentProvider('search'),
    priceAnalyzer: getAgentProvider('priceAnalyzer'),
    strategy: getAgentProvider('strategy')
  };
  
  const requiredKeys = new Set();
  Object.values(providers).forEach(provider => {
    if (provider === 'openai' || provider === 'gpt') {
      requiredKeys.add('OPENAI_API_KEY');
    } else if (provider === 'claude' || provider === 'anthropic') {
      requiredKeys.add('ANTHROPIC_API_KEY');
    } else if (provider === 'copilot' || provider === 'github') {
      requiredKeys.add('GITHUB_TOKEN');
    }
  });
  
  const missing = [];
  requiredKeys.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });
  
  if (missing.length > 0) {
    console.error(`\n❌ Missing required API keys: ${missing.join(', ')}`);
    console.error('Please add them to your .env file\n');
    return false;
  }
  
  return true;
}

/**
 * Update agent configuration in config file
 */
export function updateAgentConfig(agentType, provider) {
  const configPath = path.join(__dirname, '../../config/default.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  if (!config.agentAssignments[agentType]) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }
  
  const validProviders = ['claude', 'openai', 'copilot', 'anthropic', 'gpt', 'github'];
  if (!validProviders.includes(provider.toLowerCase())) {
    throw new Error(`Invalid provider: ${provider}. Must be one of: ${validProviders.join(', ')}`);
  }
  
  config.agentAssignments[agentType] = provider.toLowerCase();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log(`✓ Updated ${agentType} agent to use ${provider.toUpperCase()}`);
}
