#!/usr/bin/env node
import { Command } from 'commander';
import FlightScanner from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const program = new Command();

program
  .name('flightscanner')
  .description('Multi-agent AI flight price comparison tool')
  .version('1.0.0');

program
  .command('search')
  .description('Search for flights')
  .option('-f, --from <city>', 'Origin city or airport code')
  .option('-t, --to <city>', 'Destination city or airport code')
  .option('-d, --depart <date>', 'Departure date (YYYY-MM-DD)')
  .option('-r, --return <date>', 'Return date (YYYY-MM-DD)')
  .option('-p, --passengers <number>', 'Number of passengers', '1')
  .option('-c, --class <type>', 'Cabin class (economy, business, first)', 'economy')
  .action(async (options) => {
    if (!options.from || !options.to || !options.depart) {
      console.error('❌ Error: --from, --to, and --depart are required');
      process.exit(1);
    }

    const userRequest = `
      Flight from ${options.from} to ${options.to}.
      Departing ${options.depart}${options.return ? `, returning ${options.return}` : ' (one-way)'}.
      ${options.passengers} passenger(s), ${options.class} class.
    `;

    try {
      const scanner = new FlightScanner();
      await scanner.findFlights(userRequest);
    } catch (error) {
      console.error('❌ Search failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Start interactive mode')
  .action(async () => {
    console.log('🛫 Interactive Flight Scanner\n');
    
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise((resolve) => {
      rl.question(prompt, resolve);
    });

    const from = await question('From (city/airport): ');
    const to = await question('To (city/airport): ');
    const depart = await question('Departure date (YYYY-MM-DD): ');
    const returnDate = await question('Return date (YYYY-MM-DD, or press Enter for one-way): ');
    const passengers = await question('Number of passengers [1]: ') || '1';
    const cabinClass = await question('Class (economy/business/first) [economy]: ') || 'economy';

    rl.close();

    const userRequest = `
      Flight from ${from} to ${to}.
      Departing ${depart}${returnDate ? `, returning ${returnDate}` : ' (one-way)'}.
      ${passengers} passenger(s), ${cabinClass} class.
    `;

    try {
      const scanner = new FlightScanner();
      await scanner.findFlights(userRequest);
    } catch (error) {
      console.error('❌ Search failed:', error.message);
      process.exit(1);
    }
  });

program.parse();
