#!/usr/bin/env node

/**
 * Example: Using FlightScanner with Custom Agent Configuration
 * 
 * This example demonstrates how to configure and use different AI providers
 * for different agent roles in the FlightScanner system.
 */

import { FlightScanner } from './src/index.js';
import { showAgentConfiguration } from './src/utils/agentConfig.js';

console.log('='.repeat(60));
console.log('FlightScanner - Agent Configuration Example');
console.log('='.repeat(60));

// Show current configuration
console.log('\n📋 Current Configuration:');
showAgentConfiguration();

console.log('\n' + '='.repeat(60));
console.log('Starting Flight Search...');
console.log('='.repeat(60) + '\n');

// Create scanner instance (will show config and validate keys)
const scanner = new FlightScanner();

// Example flight search
const userRequest = `
  I need a flight from San Francisco (SFO) to Tokyo (NRT).
  Departing January 15, 2025, returning January 25, 2025.
  Looking for economy class, 1 passenger.
  Priority is best price but willing to consider convenience.
`;

console.log('🔍 Search Request:');
console.log(userRequest);

// Run the search
try {
  const results = await scanner.findFlights(userRequest);
  
  console.log('\n' + '='.repeat(60));
  console.log('Search Complete!');
  console.log('='.repeat(60) + '\n');
  
  // Show which providers were actually used
  console.log('🤖 Providers Used in This Search:');
  console.log(`  • Orchestrator: ${results.searchParams?.provider || 'N/A'}`);
  console.log(`  • Search Agent: ${results.searchResults?.provider || 'N/A'}`);
  console.log(`  • Price Analyzer: ${results.priceAnalysis?.provider || 'N/A'}`);
  console.log(`  • Strategy Agent: ${results.strategy?.provider || 'N/A'}`);
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('\n💡 Tips:');
  console.error('  1. Check your API keys in .env');
  console.error('  2. Run: npm run config:show');
  console.error('  3. Update configuration: npm run config set <agent> <provider>');
}

console.log('\n' + '='.repeat(60));
console.log('💡 Configuration Commands:');
console.log('='.repeat(60));
console.log('\nView config:        npm run config:show');
console.log('Set single agent:   npm run config set <agent> <provider>');
console.log('Set all agents:     npm run config set-all <provider>');
console.log('Setup API keys:     npm run config setup');
console.log('\nAvailable providers: claude, openai, copilot');
console.log('Agent types:        orchestrator, search, priceAnalyzer, strategy\n');
