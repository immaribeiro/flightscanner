#!/usr/bin/env node

/**
 * Automated Flight Price Monitor for Porto → Tokyo
 * 
 * This script runs continuously and monitors flight prices.
 * When it finds a good deal, it sends a Telegram notification.
 * 
 * Setup:
 * 1. Create Telegram bot: @BotFather
 * 2. Get chat ID: Send message to your bot, visit:
 *    https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
 * 3. Add to .env file:
 *    TELEGRAM_BOT_TOKEN=your_bot_token
 *    TELEGRAM_CHAT_ID=your_chat_id
 * 4. Run: npm run monitor:tokyo
 */

import { FlightMonitor } from './src/FlightMonitor.js';
import dotenv from 'dotenv';

dotenv.config();

const monitorConfig = {
  route: {
    from: 'Porto (OPO)',
    to: 'Tokyo Haneda (HND)',
    departDate: '2025-05-07',
    returnDate: '2025-05-28'
  },
  targetPrice: 1000, // €1000 - alert if below this
  priceThreshold: 1.0, // Alert if price is <= 100% of target (or lower)
  scanInterval: 21600000, // 6 hours = 21600000ms (4 scans per day to save tokens)
  // Scans at: 6 AM, 12 PM, 6 PM, 12 AM (optimal times for price updates)
  // Token savings: ~75% fewer API calls vs hourly scans
};

console.log(`
╔═══════════════════════════════════════════════════════╗
║     Automated Flight Price Monitor - Porto → Tokyo    ║
╚═══════════════════════════════════════════════════════╝

This will monitor flight prices and send Telegram alerts when:
  • A new lowest price is found
  • Price drops below €${monitorConfig.targetPrice}
  • Any exceptional deal is discovered

Scans will run every ${monitorConfig.scanInterval / 1000 / 60 / 60} hours (${Math.floor(24 / (monitorConfig.scanInterval / 1000 / 60 / 60))} times per day).

Press Ctrl+C to stop monitoring.
`);

// Verify Telegram is configured
if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
  console.error(`
⚠️  WARNING: Telegram not configured!

To receive notifications:
1. Create a bot with @BotFather on Telegram
2. Send a message to your bot
3. Get your chat ID from:
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
4. Add to .env:
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here

Continuing without notifications (console only)...
`);
  
  await new Promise(resolve => setTimeout(resolve, 5000));
}

const monitor = new FlightMonitor(monitorConfig);
monitor.setupShutdownHandlers();

try {
  await monitor.start();
} catch (error) {
  console.error('❌ Monitor failed to start:', error.message);
  process.exit(1);
}
