#!/usr/bin/env node

/**
 * View saved flight search results
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');

function formatPrice(price, currency = 'EUR') {
  return `${currency} €${price}`;
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function displayLatestResults() {
  const latestFile = path.join(dataDir, 'latest-flights.json');
  
  if (!fs.existsSync(latestFile)) {
    console.log(chalk.yellow('\n⚠️  No results found yet. Wait for the first scan to complete.\n'));
    return;
  }

  const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
  
  console.log('\n' + '═'.repeat(80));
  console.log(chalk.bold.cyan('                     LATEST FLIGHT SEARCH RESULTS'));
  console.log('═'.repeat(80));
  console.log(chalk.gray(`Last Updated: ${new Date(data.lastUpdated).toLocaleString()}`));
  console.log(chalk.gray(`Route: ${data.route.from} → ${data.route.to}`));
  console.log(chalk.gray(`Target Price: €${data.targetPrice}`));
  console.log(chalk.gray(`Total Scans: ${data.totalScans}`));
  
  if (data.bestPriceFound) {
    console.log(chalk.green(`\n🏆 Best Price Ever Found: €${data.bestPriceFound.price}`));
    console.log(chalk.gray(`   Found on: ${new Date(data.bestPriceFound.date).toLocaleString()}`));
  }
  
  console.log('\n' + '─'.repeat(80));
  console.log(chalk.bold.white('FLIGHTS FOUND:\n'));
  
  if (data.searchResults.flights && data.searchResults.flights.length > 0) {
    data.searchResults.flights.forEach((flight, i) => {
      const price = flight.totalPrice || flight.price;
      console.log(chalk.bold(`${i + 1}. ${formatPrice(price, flight.currency)}`));
      
      if (flight.outbound) {
        console.log(`   ${chalk.cyan('→')} ${flight.outbound.airline} - ${formatDateTime(flight.outbound.departure)}`);
        console.log(`      ${flight.outbound.departureAirport} → ${flight.outbound.arrivalAirport}`);
        console.log(`      ${Math.floor(flight.outbound.duration/60)}h ${flight.outbound.duration%60}m, ${flight.outbound.stops} stop(s)`);
      }
      
      if (flight.return) {
        console.log(`   ${chalk.magenta('←')} ${flight.return.airline} - ${formatDateTime(flight.return.departure)}`);
        console.log(`      ${flight.return.departureAirport} → ${flight.return.arrivalAirport}`);
        console.log(`      ${Math.floor(flight.return.duration/60)}h ${flight.return.duration%60}m, ${flight.return.stops} stop(s)`);
      }
      
      if (flight.link) {
        console.log(`   ${chalk.blue('🔗')} ${flight.link}`);
      }
      
      if (flight.flexibility && flight.flexibility !== 'EXACT_DATES') {
        console.log(`   ${chalk.yellow('📅')} ${flight.flexibility}${flight.savings ? ` (Save ${flight.savings})` : ''}`);
      }
      
      console.log('');
    });
  } else {
    console.log(chalk.yellow('   No flights in latest results\n'));
  }
  
  if (data.priceAnalysis) {
    console.log('─'.repeat(80));
    console.log(chalk.bold.cyan('PRICE ANALYSIS:\n'));
    
    if (data.priceAnalysis.priceRange) {
      console.log(`   Lowest:  ${chalk.green('€' + data.priceAnalysis.priceRange.min)}`);
      console.log(`   Highest: ${chalk.red('€' + data.priceAnalysis.priceRange.max)}`);
      console.log(`   Average: ${chalk.yellow('€' + data.priceAnalysis.priceRange.average)}`);
    }
    
    if (data.priceAnalysis.recommendations && data.priceAnalysis.recommendations.length > 0) {
      console.log(chalk.white('\n   Insights:'));
      data.priceAnalysis.recommendations.slice(0, 3).forEach(rec => {
        console.log(chalk.gray(`    • ${rec}`));
      });
    }
    console.log('');
  }
  
  console.log('═'.repeat(80) + '\n');
}

function listAllScans() {
  if (!fs.existsSync(dataDir)) {
    console.log(chalk.yellow('\n⚠️  No data directory found.\n'));
    return;
  }

  const files = fs.readdirSync(dataDir)
    .filter(f => f.startsWith('flights-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log(chalk.yellow('\n⚠️  No scan results found yet.\n'));
    return;
  }

  console.log('\n' + '═'.repeat(80));
  console.log(chalk.bold.cyan('                     ALL FLIGHT SCANS'));
  console.log('═'.repeat(80) + '\n');

  files.forEach((file, i) => {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const flightCount = data.searchResults?.flights?.length || 0;
    const cheapest = data.searchResults?.flights?.reduce((min, f) => {
      const price = f.totalPrice || f.price;
      return price < min ? price : min;
    }, Infinity);

    console.log(chalk.bold(`${i + 1}. ${new Date(data.timestamp).toLocaleString()}`));
    console.log(`   Flights found: ${flightCount}`);
    if (cheapest !== Infinity) {
      console.log(`   Cheapest: ${chalk.green('€' + cheapest)}`);
    }
    console.log(`   File: ${chalk.gray(file)}\n`);
  });

  console.log('═'.repeat(80));
  console.log(chalk.gray(`\nTotal scans: ${files.length}`));
  console.log(chalk.gray(`To view a specific scan: cat data/${files[0]}\n`));
}

function showHelp() {
  console.log(`
${chalk.bold.cyan('Flight Results Viewer')}

Usage:
  ${chalk.bold('npm run view:flights')}              View latest results
  ${chalk.bold('npm run view:flights -- --all')}     List all scans
  ${chalk.bold('npm run view:flights -- --help')}    Show this help

Files are saved in:
  ${chalk.gray('data/latest-flights.json')}      Latest scan results (always current)
  ${chalk.gray('data/flights-<timestamp>.json')}  Individual scan results
  ${chalk.gray('data/price-history.json')}       Price tracking history

You can also view them directly:
  ${chalk.gray('cat data/latest-flights.json')}
  ${chalk.gray('ls data/flights-*.json')}
`);
}

// Main
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
} else if (args.includes('--all') || args.includes('-a')) {
  listAllScans();
} else {
  displayLatestResults();
}
