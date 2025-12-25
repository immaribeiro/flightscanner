# Viewing Flight Results

Your flight monitor saves **complete results** from every scan so you can review them anytime!

## 📂 What Gets Saved

### 1. Latest Results (Always Current)
**File**: `data/latest-flights.json`

This file is **always updated** with the most recent scan results. Perfect for quick checks.

```bash
# View latest results (formatted)
npm run view:flights

# Or view raw JSON
cat data/latest-flights.json
```

### 2. Individual Scan Results (Historical)
**Files**: `data/flights-<timestamp>.json`

Every scan creates a **new file** with complete results:
- All flights found (even if not below target)
- Complete flight details (outbound + return)
- Price analysis
- Booking strategy
- AI recommendations

```bash
# List all scans
npm run view:all

# View specific scan
cat data/flights-1703516400000.json
```

### 3. Price History (Tracking)
**File**: `data/price-history.json`

Tracks price trends over time:
- Best price ever found
- All scan summaries
- Price statistics

```bash
cat data/price-history.json
```

---

## 🔍 Viewing Commands

### View Latest Results
```bash
npm run view:flights
```

Shows:
- ✅ All flights from latest scan
- ✅ Complete details (times, airlines, layovers)
- ✅ Booking links
- ✅ Price analysis
- ✅ Best price found so far

### List All Scans
```bash
npm run view:all
```

Shows:
- ✅ All historical scans
- ✅ Number of flights found
- ✅ Cheapest price in each scan
- ✅ Timestamps

### View Raw JSON
```bash
# Latest
cat data/latest-flights.json | python3 -m json.tool

# Specific scan
cat data/flights-1703516400000.json | python3 -m json.tool

# List all scan files
ls -lh data/flights-*.json
```

---

## 📊 Example Output

### Latest Results View
```
═══════════════════════════════════════════════════════════
                 LATEST FLIGHT SEARCH RESULTS
═══════════════════════════════════════════════════════════
Last Updated: Dec 25, 2024, 1:30:00 PM
Route: Porto (OPO) → Tokyo Haneda (HND)
Target Price: €1000
Total Scans: 5

🏆 Best Price Ever Found: €1089
   Found on: Dec 25, 2024, 9:00:00 AM

────────────────────────────────────────────────────────────
FLIGHTS FOUND:

1. EUR €1089
   → SWISS - Dec 9, 12:30 PM
      OPO → HND
      26h 45m, 1 stop(s)
   ← SWISS - Dec 26, 10:15 AM
      HND → OPO
      24h 30m, 1 stop(s)
   🔗 https://www.skyscanner.com/...
   📅 FLEXIBLE ±2 days (Save €235)

2. EUR €1195
   → Finnair - Dec 6, 8:00 AM
      OPO → HND
      24h 20m, 1 stop(s)
   ← Finnair - Dec 29, 3:45 PM
      HND → OPO
      24h 30m, 1 stop(s)
   🔗 https://www.momondo.com/...

...

────────────────────────────────────────────────────────────
PRICE ANALYSIS:

   Lowest:  €1089
   Highest: €1756
   Average: €1348

   Insights:
    • SWISS offers best value at €1089
    • Finnair provides fastest connections
    • Consider flexible dates to save €100-300

═══════════════════════════════════════════════════════════
```

---

## 🗂️ Data Directory Structure

```
data/
├── latest-flights.json          # Most recent scan (always current)
├── flights-1703516400000.json   # Scan from specific time
├── flights-1703520000000.json   # Another scan
├── flights-1703523600000.json   # And another...
└── price-history.json           # Price tracking data
```

---

## 💡 Use Cases

### 1. Review All Options
Even if no flights are below your target, you can still see all options found:
```bash
npm run view:flights
```

### 2. Compare Across Time
See how prices changed over multiple scans:
```bash
npm run view:all
```

### 3. Find Specific Flight
Search through saved results:
```bash
grep -r "Finnair" data/flights-*.json
```

### 4. Export to Spreadsheet
```bash
# Get all prices
jq '.searchResults.flights[] | {airline: .outbound.airline, price: .totalPrice}' data/latest-flights.json
```

### 5. Check History
```bash
# See all scan times and prices
jq '.scans[] | {date, bestPrice}' data/price-history.json
```

---

## 🔄 Data Retention

- **Latest results**: Always kept, overwritten on each scan
- **Individual scans**: Kept forever (unless you manually delete)
- **Price history**: Grows indefinitely

### Clean Up Old Scans
```bash
# Keep only last 30 scans
cd data
ls -t flights-*.json | tail -n +31 | xargs rm

# Or keep only last 7 days
find data/flights-*.json -mtime +7 -delete
```

---

## 📱 Integration

### View on Mobile
The `latest-flights.json` file can be:
- Synced to cloud (Dropbox, iCloud)
- Served via local web server
- Parsed by mobile apps

### Example: Simple Web View
```bash
# Start a simple web server
cd data
python3 -m http.server 8000

# Then visit: http://localhost:8000/latest-flights.json
```

---

## 🆘 Troubleshooting

### No results showing?
```bash
# Check if files exist
ls data/

# Check latest scan time
jq '.lastUpdated' data/latest-flights.json

# View monitor logs
npx pm2 logs flight-monitor
```

### Files too large?
Each scan with 10 flights ≈ 50KB. After 100 scans ≈ 5MB.

```bash
# Check total size
du -sh data/

# Clean old scans (keep last 50)
cd data && ls -t flights-*.json | tail -n +51 | xargs rm
```

---

## Quick Reference

```bash
# View latest results
npm run view:flights

# List all scans
npm run view:all

# Raw JSON (latest)
cat data/latest-flights.json

# Raw JSON (specific scan)
cat data/flights-<timestamp>.json

# Price history
cat data/price-history.json

# Count scans
ls data/flights-*.json | wc -l

# Total data size
du -sh data/
```

---

**All results are saved automatically!** Even if flights aren't below your target price, you can always review what was found. 📊✈️
