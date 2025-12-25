# Automated Flight Monitoring Setup Guide

This guide will help you set up a 24/7 automated flight price monitor that runs on your machine and sends Telegram alerts when it finds great deals.

## 🎯 What This Does

- **Runs continuously** in the background on your Mac
- **Scans flight prices** every hour (configurable)
- **Sends Telegram notifications** when it finds:
  - New lowest prices
  - Prices below your target
  - Great deals worth considering
- **Tracks price history** to show trends
- **Survives restarts** - automatically starts when your Mac boots

## 📋 Prerequisites

- ✅ Node.js installed
- ✅ FlightScanner already set up
- ✅ API keys configured (Claude, OpenAI, or Copilot)
- 📱 Telegram account

---

## Step 1: Create Your Telegram Bot

### 1.1 Create the Bot

1. Open Telegram and search for **@BotFather**
2. Start a chat and send `/newbot`
3. Follow the prompts:
   - **Bot name**: `My Flight Monitor` (or any name)
   - **Username**: Must end in 'bot', e.g., `my_flight_deals_bot`
4. **Save the bot token** - looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### 1.2 Get Your Chat ID

1. Send a message to your new bot (any message)
2. Visit this URL in your browser (replace YOUR_BOT_TOKEN):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
3. Look for `"chat":{"id":` - the number after is your chat ID
4. Example: `"id":123456789` → your chat ID is `123456789`

### 1.3 Add to .env File

```bash
# Open your .env file
nano .env

# Add these lines (replace with your actual values):
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

Save and exit (Ctrl+X, then Y, then Enter).

---

## Step 2: Configure Your Monitor

Edit `monitor-tokyo.js` to customize:

```javascript
const monitorConfig = {
  route: {
    from: 'Porto (OPO)',
    to: 'Tokyo Haneda (HND)',
    departDate: '2025-05-07',      // Your travel dates
    returnDate: '2025-05-28'
  },
  targetPrice: 1000,                // €1000 - alert if below this
  priceThreshold: 1.0,              // Alert at 100% of target (or lower)
  scanInterval: 3600000,            // 1 hour in milliseconds
};
```

**Scan Interval Options:**
- 5 minutes: `300000`
- 10 minutes: `600000`
- 30 minutes: `1800000`
- 1 hour: `3600000` (recommended)
- 2 hours: `7200000`
- 6 hours: `21600000`

---

## Step 3: Test the Monitor

### 3.1 Quick Test (Runs Once)

```bash
npm run search:tokyo
```

Verify it finds flights and shows prices.

### 3.2 Test Monitor (Foreground)

```bash
npm run monitor:tokyo
```

- Should show "Flight monitor started!"
- Wait for first scan to complete
- Check Telegram - you should receive a notification
- Press **Ctrl+C** to stop

---

## Step 4: Run Monitor 24/7 with PM2

PM2 keeps your monitor running forever, even after you close the terminal or restart your Mac.

### 4.1 Start the Monitor

```bash
npm run monitor:start
```

Output should show:
```
[PM2] Process successfully started
```

### 4.2 Check Status

```bash
npm run monitor:status
```

Shows if it's running and how long it's been active.

### 4.3 View Logs

```bash
npm run monitor:logs
```

Press **Ctrl+C** to exit logs (monitor keeps running).

### 4.4 Stop Monitor

```bash
npm run monitor:stop
```

### 4.5 Restart Monitor

```bash
npm run monitor:restart
```

---

## Step 5: Auto-Start on Mac Boot

Make the monitor start automatically when your Mac starts.

```bash
# Save PM2 startup configuration
pm2 save

# Setup auto-start
pm2 startup
```

Follow the command it suggests (will ask for your password).

Now your monitor will:
- ✅ Start when Mac boots
- ✅ Restart if it crashes
- ✅ Keep running forever

---

## 📊 Monitoring & Management

### Check What's Running

```bash
npm run monitor:status
```

### View Real-Time Logs

```bash
npm run monitor:logs
```

### Price History

Price data is saved in `data/price-history.json`:
```bash
cat data/price-history.json
```

### Stats

Every 10 scans, the monitor shows statistics:
- Total scans performed
- Average price found
- Price range (min-max)
- Best price ever found

---

## 🔔 What Triggers Notifications

You'll receive a Telegram message when:

1. **New Best Price**: Lower than any price seen before
2. **Below Target**: Price at or below your target price (€1000)
3. **Great Deal**: Significant savings vs. average prices

Each notification includes:
- ✈️ Complete flight details (both directions)
- 💰 Total price and savings
- 📅 Travel dates
- 🔗 Direct booking link
- 🕐 Timestamp

---

## 🔧 Customization

### Change Scan Frequency

Edit `monitor-tokyo.js`:
```javascript
scanInterval: 1800000,  // 30 minutes instead of 1 hour
```

Then restart:
```bash
npm run monitor:restart
```

### Change Target Price

Edit `monitor-tokyo.js`:
```javascript
targetPrice: 900,  // Alert if below €900
```

### Monitor Multiple Routes

Create new files:
```bash
# Copy the monitor
cp monitor-tokyo.js monitor-paris.js

# Edit for Paris route
nano monitor-paris.js

# Start it
pm2 start monitor-paris.js --name paris-monitor
```

---

## 🐛 Troubleshooting

### No Telegram Notifications

1. **Check credentials**:
   ```bash
   cat .env | grep TELEGRAM
   ```

2. **Test bot manually**:
   ```
   https://api.telegram.org/botYOUR_TOKEN/sendMessage?chat_id=YOUR_CHAT_ID&text=Test
   ```

3. **Check logs**:
   ```bash
   npm run monitor:logs
   ```

### Monitor Not Running

```bash
# Check PM2 status
npm run monitor:status

# If stopped, start it
npm run monitor:start

# Check for errors in logs
npm run monitor:logs
```

### High API Usage

If you're making too many API calls:

1. **Increase scan interval**:
   ```javascript
   scanInterval: 7200000,  // 2 hours
   ```

2. **Use rate limiting** in `.env`:
   ```
   REQUEST_DELAY_MS=2000
   ```

### AI Errors

Check which agent is configured:
```bash
npm run config:show
```

Claude works best for complex searches:
```bash
npm run config set-all claude
npm run monitor:restart
```

---

## 📈 Best Practices

1. **Start with shorter intervals** (30 min) to test, then increase to 1-2 hours
2. **Set realistic target prices** based on initial searches
3. **Check logs daily** for the first week
4. **Adjust thresholds** based on price patterns
5. **Don't run too frequently** - respect API rate limits

---

## 🎉 You're All Set!

Your automated flight monitor is now:
- ✅ Running 24/7
- ✅ Scanning every hour
- ✅ Sending Telegram alerts
- ✅ Auto-starting on boot
- ✅ Tracking price history

When you receive an alert for a great deal:
1. Click the booking link in Telegram
2. Review the flight details
3. Book if it meets your needs!

---

## Quick Command Reference

```bash
# Start monitor (background)
npm run monitor:start

# Stop monitor
npm run monitor:stop

# Restart monitor
npm run monitor:restart

# Check status
npm run monitor:status

# View logs
npm run monitor:logs

# Test search (one-time)
npm run search:tokyo

# Test monitor (foreground)
npm run monitor:tokyo
```

Happy flight hunting! 🛫✨
