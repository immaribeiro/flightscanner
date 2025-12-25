import { FlightScanner } from './index.js';
import { TelegramNotifier } from './services/telegram.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Automated flight price monitoring system
 * Runs continuously and sends Telegram alerts for good deals
 */
export class FlightMonitor {
  constructor(config) {
    this.config = {
      route: config.route,
      targetPrice: config.targetPrice,
      scanInterval: config.scanInterval || 3600000, // 1 hour default
      priceThreshold: config.priceThreshold || 0.9, // Alert if 10% below target
      ...config
    };
    
    this.notifier = new TelegramNotifier();
    this.scanner = new FlightScanner();
    this.historyFile = path.join(__dirname, '../data/price-history.json');
    this.priceHistory = this.loadPriceHistory();
    this.isRunning = false;
  }

  loadPriceHistory() {
    try {
      const dataDir = path.join(__dirname, '../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      if (fs.existsSync(this.historyFile)) {
        const data = fs.readFileSync(this.historyFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.log('Creating new price history...');
    }
    
    return { scans: [], bestPrice: null, lastScan: null };
  }

  savePriceHistory() {
    try {
      fs.writeFileSync(this.historyFile, JSON.stringify(this.priceHistory, null, 2));
    } catch (error) {
      console.error('Failed to save price history:', error.message);
    }
  }

  saveFlightResults(scanId, results) {
    try {
      const resultsFile = path.join(__dirname, `../data/flights-${scanId}.json`);
      const summary = {
        scanId,
        timestamp: new Date().toISOString(),
        route: this.config.route,
        searchResults: results.searchResults,
        priceAnalysis: results.priceAnalysis,
        strategy: results.strategy,
        finalRecommendation: results.finalRecommendation
      };
      fs.writeFileSync(resultsFile, JSON.stringify(summary, null, 2));
      console.log(`💾 Full results saved: flights-${scanId}.json`);
    } catch (error) {
      console.error('Failed to save flight results:', error.message);
    }
  }

  saveLatestResults(results) {
    try {
      const latestFile = path.join(__dirname, '../data/latest-flights.json');
      const summary = {
        lastUpdated: new Date().toISOString(),
        route: this.config.route,
        targetPrice: this.config.targetPrice,
        bestPriceFound: this.priceHistory.bestPrice,
        totalScans: this.priceHistory.scans.length,
        searchResults: results.searchResults,
        priceAnalysis: results.priceAnalysis,
        strategy: results.strategy,
        finalRecommendation: results.finalRecommendation
      };
      fs.writeFileSync(latestFile, JSON.stringify(summary, null, 2));
      console.log(`💾 Latest results updated: latest-flights.json`);
    } catch (error) {
      console.error('Failed to save latest results:', error.message);
    }
  }

  async start() {
    this.isRunning = true;
    console.log('\n' + '═'.repeat(80));
    console.log('🤖 AUTOMATED FLIGHT MONITOR STARTED');
    console.log('═'.repeat(80));
    console.log(`📍 Route: ${this.config.route.from} → ${this.config.route.to}`);
    console.log(`📅 Dates: ${this.config.route.departDate} to ${this.config.route.returnDate}`);
    console.log(`💰 Target Price: €${this.config.targetPrice}`);
    console.log(`⏱️  Scan Interval: ${this.config.scanInterval / 1000 / 60} minutes`);
    console.log(`🔔 Alert Threshold: ${(this.config.priceThreshold * 100)}% of target price`);
    console.log('═'.repeat(80) + '\n');

    await this.notifier.sendStatusUpdate(
      `Flight monitor started!\n` +
      `Route: ${this.config.route.from} → ${this.config.route.to}\n` +
      `Target: €${this.config.targetPrice}`
    );

    // Run first scan immediately
    await this.scan();

    // Schedule periodic scans
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        this.scan();
      }
    }, this.config.scanInterval);
  }

  async scan() {
    const scanId = Date.now();
    console.log(`\n🔍 [${new Date().toLocaleString()}] Starting scan #${this.priceHistory.scans.length + 1}...`);

    try {
      const userRequest = `
        Round-trip flight from ${this.config.route.from} to ${this.config.route.to}.
        Departure: ${this.config.route.departDate}
        Return: ${this.config.route.returnDate}
        Show flexible date options (±3 days) if cheaper or faster.
        1 passenger, economy class.
      `;

      const results = await this.scanner.findFlights(userRequest);

      if (!results.searchResults.flights || results.searchResults.flights.length === 0) {
        console.log('⚠️  No flights found in this scan');
        return;
      }

      // Save complete results for this scan
      this.saveFlightResults(scanId, results);
      this.saveLatestResults(results);

      // Find best price from this scan
      const flights = results.searchResults.flights;
      const cheapestFlight = flights.reduce((min, flight) => {
        const price = flight.totalPrice || flight.price || Infinity;
        const minPrice = min.totalPrice || min.price || Infinity;
        return price < minPrice ? flight : min;
      }, flights[0]);

      const currentBestPrice = cheapestFlight.totalPrice || cheapestFlight.price;

      // Record scan
      this.priceHistory.scans.push({
        timestamp: scanId,
        date: new Date().toISOString(),
        bestPrice: currentBestPrice,
        flightCount: flights.length
      });
      this.priceHistory.lastScan = new Date().toISOString();

      console.log(`💰 Best price this scan: €${currentBestPrice}`);

      // Check if this is a new best price
      const isNewBest = !this.priceHistory.bestPrice || currentBestPrice < this.priceHistory.bestPrice.price;
      
      // Check if price is below threshold
      const isBelowThreshold = currentBestPrice <= (this.config.targetPrice * this.config.priceThreshold);

      if (isNewBest) {
        console.log(`🎉 NEW BEST PRICE! €${currentBestPrice} (previous: €${this.priceHistory.bestPrice?.price || 'N/A'})`);
        this.priceHistory.bestPrice = {
          price: currentBestPrice,
          date: new Date().toISOString(),
          flight: cheapestFlight
        };
        
        // Always notify on new best price
        await this.notifier.sendFlightAlert(cheapestFlight);
      } else if (isBelowThreshold) {
        const savings = this.config.targetPrice - currentBestPrice;
        console.log(`💎 GREAT DEAL! €${currentBestPrice} (€${savings} below target)`);
        
        // Notify if it's a great deal (even if not the best ever)
        await this.notifier.sendFlightAlert(cheapestFlight);
      } else {
        console.log(`📊 Price: €${currentBestPrice} (target: €${this.config.targetPrice})`);
      }

      this.savePriceHistory();

      // Show stats
      if (this.priceHistory.scans.length % 10 === 0) {
        this.showStats();
      }

    } catch (error) {
      console.error(`❌ Scan error:`, error.message);
      
      if (this.priceHistory.scans.length > 0) {
        await this.notifier.sendError(`Scan failed: ${error.message}`);
      }
    }
  }

  showStats() {
    const scans = this.priceHistory.scans;
    const prices = scans.map(s => s.bestPrice);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    console.log('\n' + '─'.repeat(80));
    console.log('📊 MONITORING STATISTICS');
    console.log('─'.repeat(80));
    console.log(`Total Scans: ${scans.length}`);
    console.log(`Average Price: €${avgPrice.toFixed(2)}`);
    console.log(`Price Range: €${minPrice} - €${maxPrice}`);
    console.log(`Best Ever: €${this.priceHistory.bestPrice?.price || 'N/A'}`);
    console.log(`Target: €${this.config.targetPrice}`);
    console.log('─'.repeat(80) + '\n');
  }

  stop() {
    console.log('\n🛑 Stopping flight monitor...');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.showStats();
    this.notifier.sendStatusUpdate('Flight monitor stopped.');
    console.log('✅ Monitor stopped\n');
  }

  // Graceful shutdown
  setupShutdownHandlers() {
    const shutdown = () => {
      this.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}
