#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('agent-config')
  .description('Configure AI agents for FlightScanner')
  .version('1.0.0');

// Show current configuration
program
  .command('show')
  .description('Show current agent configuration')
  .action(() => {
    const configPath = path.join(__dirname, '../config/default.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║          Current Agent Configuration                 ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════╝\n'));
    
    console.log(chalk.bold('Agent Roles:'));
    console.log(`  ${chalk.yellow('🎯 Orchestrator:')}    ${chalk.green(config.agentAssignments.orchestrator.toUpperCase())}`);
    console.log(`  ${chalk.yellow('🔍 Search Agent:')}    ${chalk.green(config.agentAssignments.search.toUpperCase())}`);
    console.log(`  ${chalk.yellow('💰 Price Analyzer:')}  ${chalk.green(config.agentAssignments.priceAnalyzer.toUpperCase())}`);
    console.log(`  ${chalk.yellow('🎲 Strategy Agent:')}  ${chalk.green(config.agentAssignments.strategy.toUpperCase())}\n`);
    
    console.log(chalk.bold('Available API Keys:'));
    console.log(`  OpenAI:    ${process.env.OPENAI_API_KEY ? chalk.green('✓ Configured') : chalk.red('✗ Missing')}`);
    console.log(`  Claude:    ${process.env.ANTHROPIC_API_KEY ? chalk.green('✓ Configured') : chalk.red('✗ Missing')}`);
    console.log(`  Copilot:   ${process.env.GITHUB_TOKEN ? chalk.green('✓ Configured') : chalk.red('✗ Missing')}\n`);
    
    console.log(chalk.bold('Configuration Options:'));
    console.log(`  • ${chalk.cyan('claude')} or ${chalk.cyan('anthropic')} - Use Claude AI`);
    console.log(`  • ${chalk.cyan('openai')} or ${chalk.cyan('gpt')} - Use OpenAI GPT-4`);
    console.log(`  • ${chalk.cyan('copilot')} or ${chalk.cyan('github')} - Use GitHub Copilot Pro\n`);
  });

// Set agent provider
program
  .command('set <agent> <provider>')
  .description('Set the AI provider for a specific agent')
  .action((agent, provider) => {
    const configPath = path.join(__dirname, '../config/default.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    const validAgents = ['orchestrator', 'search', 'priceAnalyzer', 'strategy'];
    const validProviders = ['claude', 'openai', 'copilot', 'anthropic', 'gpt', 'github'];
    
    if (!validAgents.includes(agent)) {
      console.error(chalk.red(`\n❌ Invalid agent: ${agent}`));
      console.log(chalk.yellow(`Valid agents: ${validAgents.join(', ')}\n`));
      process.exit(1);
    }
    
    if (!validProviders.includes(provider.toLowerCase())) {
      console.error(chalk.red(`\n❌ Invalid provider: ${provider}`));
      console.log(chalk.yellow(`Valid providers: ${validProviders.join(', ')}\n`));
      process.exit(1);
    }
    
    config.agentAssignments[agent] = provider.toLowerCase();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log(chalk.green(`\n✓ Updated ${agent} agent to use ${provider.toUpperCase()}\n`));
  });

// Set all agents to the same provider
program
  .command('set-all <provider>')
  .description('Set all agents to use the same AI provider')
  .action((provider) => {
    const configPath = path.join(__dirname, '../config/default.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    const validProviders = ['claude', 'openai', 'copilot', 'anthropic', 'gpt', 'github'];
    
    if (!validProviders.includes(provider.toLowerCase())) {
      console.error(chalk.red(`\n❌ Invalid provider: ${provider}`));
      console.log(chalk.yellow(`Valid providers: ${validProviders.join(', ')}\n`));
      process.exit(1);
    }
    
    config.agentAssignments.orchestrator = provider.toLowerCase();
    config.agentAssignments.search = provider.toLowerCase();
    config.agentAssignments.priceAnalyzer = provider.toLowerCase();
    config.agentAssignments.strategy = provider.toLowerCase();
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log(chalk.green(`\n✓ All agents now use ${provider.toUpperCase()}\n`));
  });

// Interactive setup
program
  .command('setup')
  .description('Interactive setup wizard for API keys')
  .action(async () => {
    const readline = (await import('readline')).default;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║          FlightScanner Setup Wizard                   ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════╝\n'));
    
    console.log(chalk.yellow('This wizard will help you configure your API keys.\n'));
    console.log(chalk.gray('Press Enter to skip any key you don\'t have.\n'));
    
    const envPath = path.join(__dirname, '../.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    const updateEnv = (key, value) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    };
    
    const question = (query) => new Promise(resolve => rl.question(query, resolve));
    
    const openaiKey = await question(chalk.cyan('OpenAI API Key: '));
    if (openaiKey.trim()) updateEnv('OPENAI_API_KEY', openaiKey.trim());
    
    const claudeKey = await question(chalk.cyan('Anthropic Claude API Key: '));
    if (claudeKey.trim()) updateEnv('ANTHROPIC_API_KEY', claudeKey.trim());
    
    const githubToken = await question(chalk.cyan('GitHub Token (for Copilot): '));
    if (githubToken.trim()) updateEnv('GITHUB_TOKEN', githubToken.trim());
    
    fs.writeFileSync(envPath, envContent.trim());
    
    console.log(chalk.green('\n✓ Configuration saved to .env file\n'));
    
    rl.close();
  });

program.parse();
