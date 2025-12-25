#!/usr/bin/env node

/**
 * Search flights from Porto to Tokyo Haneda
 * May 7-28, 2025 with flexible dates
 */

import { FlightScanner } from './src/index.js';

console.log('🛫 Searching Porto (OPO) → Tokyo Haneda (HND)\n');
console.log('📅 Flexible dates: May 7-28, 2025');
console.log('💡 Looking for cheaper and faster alternatives\n');

const userRequest = `
  I need a round-trip flight from Porto, Portugal (OPO) to Tokyo Haneda (HND), Japan.
  
  Preferred outbound date: May 7, 2025
  Preferred return date: May 28, 2025
  
  IMPORTANT REQUIREMENTS:
  - Show flexible date options (±3 days) if they are CHEAPER or FASTER
  - I'm willing to adjust dates to save money or reduce travel time
  - Show both direct and connecting flights
  - 1 passenger, economy class
  - Priority: Best combination of price and speed
  
  Please include:
  - Complete round-trip prices
  - Both outbound AND return flight details
  - Flight numbers, layover information
  - Flexible date alternatives that save money
  - Direct booking links
`;

async function searchFlights() {
  try {
    const scanner = new FlightScanner();
    const results = await scanner.findFlights(userRequest);
    
    console.log('\n✅ Search completed!');
    console.log('\n💡 Tips:');
    console.log('  - Green ⭐ indicates best price');
    console.log('  - 📅 Flexible dates show how much you can save');
    console.log('  - Direct flights are highlighted in green');
    console.log('  - Click the booking links to purchase\n');
    
    return results;
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Make sure you have:');
    console.error('  1. Valid API keys in .env');
    console.error('  2. Agents configured (npm run config:show)');
    console.error('  3. Internet connection\n');
    process.exit(1);
  }
}

searchFlights();
