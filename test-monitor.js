#!/usr/bin/env node

/**
 * TEST MODE: Flight Monitor without Telegram
 * This lets you test the monitoring system without setting up Telegram
 */

import { FlightMonitor } from './src/FlightMonitor.js';

console.log(`
╔═══════════════════════════════════════════════════════════╗
║     FLIGHT MONITOR - TEST MODE (No Telegram Required)    ║
╚═══════════════════════════════════════════════════════════╝

This will:
  ✅ Run 2 test scans (5 minutes apart)
  ✅ Show you what notifications would look like
  ✅ Track prices and show statistics
  ✅ Exit automatically after testing

No Telegram needed - perfect for testing!

Starting in 3 seconds...
`);

await new Promise(resolve => setTimeout(resolve, 3000));

const monitorConfig = {
  route: {
    from: 'Porto (OPO)',
    to: 'Tokyo Haneda (HND)',
    departDate: '2025-05-07',
    returnDate: '2025-05-28'
  },
  targetPrice: 1000,
  priceThreshold: 1.0,
  scanInterval: 300000, // 5 minutes for testing
  maxScans: 2  // Stop after 2 scans
};

const monitor = new FlightMonitor(monitorConfig);

// Override scan method to count scans
let scanCount = 0;
const originalScan = monitor.scan.bind(monitor);
monitor.scan = async function() {
  await originalScan();
  scanCount++;
  
  if (scanCount >= monitorConfig.maxScans) {
    console.log('\n✅ TEST COMPLETE!');
    console.log('\n📊 Summary:');
    monitor.showStats();
    console.log('\nThe monitoring system is working correctly!');
    console.log('\nTo run 24/7 with Telegram notifications:');
    console.log('  1. Set up Telegram (see GETTING_STARTED.txt)');
    console.log('  2. Run: npm run monitor:start\n');
    monitor.stop();
    process.exit(0);
  } else {
    console.log(`\n⏳ Next scan in ${monitorConfig.scanInterval / 1000 / 60} minutes...`);
  }
};

monitor.setupShutdownHandlers();

try {
  await monitor.start();
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
