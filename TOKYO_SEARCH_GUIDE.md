# Porto to Tokyo Flight Search - Quick Guide

## Your Custom Search

```bash
npm run search:tokyo
```

This searches for:
- **Route**: Porto (OPO) → Tokyo Haneda (HND) → Porto
- **Dates**: May 7-28, 2025 (with ±3 days flexibility)
- **Passengers**: 1 adult, Economy class
- **Priority**: Cheaper and faster alternatives

## What You Get

### ✈️ Round-Trip Flight Details
- **Outbound Flight**: Porto → Tokyo with date, airline, flight number, layovers
- **Return Flight**: Tokyo → Porto with complete details
- **Total Price**: Combined price for both legs
- **Flexible Dates**: Shows if adjusting dates by 1-3 days saves money

### 💰 Price Analysis
- Lowest, highest, and average prices
- Best deals highlighted
- Savings opportunities
- Warnings about overpriced options

### 🎲 Booking Strategy
- When to book (book now vs. wait)
- Alternative dates to save money
- Tips for finding better deals
- Price alert recommendations

## Latest Results (Example)

From your last search:

**Best Options:**
1. **Finnair** - €1,195 (24h 20min travel) - **RECOMMENDED**
   - May 6-29 dates
   - 1 stop in Helsinki
   - Best balance of price and speed

2. **SWISS** - €1,089 (26h 45min travel) - **CHEAPEST**
   - May 9-26 dates  
   - 1 stop in Zurich
   - €341 below average

3. **Turkish Airlines** - €1,312-€1,389
   - Multiple date options
   - 1 stop in Istanbul
   - Good mid-range choice

**Avoid:**
- TAP Air Portugal - €1,756 (too expensive, 2 stops)
- KLM - €1,567 (overpriced for routing)

## Custom Searches

### Search Any Route

Edit `search-tokyo.js` and change:
```javascript
const userRequest = `
  Round-trip flight from CITY1 (AIRPORT_CODE) to CITY2 (AIRPORT_CODE).
  Outbound: DATE1
  Return: DATE2
  Show flexible date options if cheaper or faster.
`;
```

### Using the CLI

```bash
npm run cli search \
  --from "Porto" \
  --to "Tokyo" \
  --depart "2025-05-07" \
  --return "2025-05-28"
```

## Understanding the Output

### 📅 Flexible Dates
- **EXACT_DATES**: Your requested dates
- **FLEXIBLE ±1 day**: 1 day before/after
- **FLEXIBLE ±2-3 days**: 2-3 days before/after
- **Savings**: How much you save with flexible dates

### 🔄 Stops
- **Direct Flight** ✈️ (green) - Non-stop
- **1 Stop** (yellow) - One layover
- **2 Stops** (yellow) - Two layovers

### 💰 Price Indicators
- **⭐ BEST PRICE**: Cheapest option
- Green border = Best deal
- Gray border = Other options

### 🔗 Booking Links
- Click or copy the link to book directly
- Links go to Skyscanner, Momondo, or Google Flights

## Tips for Better Results

1. **Be Flexible with Dates**
   - ±3 days can save €100-300
   - Weekday flights often cheaper than weekends

2. **Monitor Prices**
   - Set alerts if booking >2 months out
   - Prices fluctuate, check regularly

3. **Consider Layovers**
   - 1 stop can be 30-50% cheaper
   - Check layover times (2-4 hours ideal)

4. **European Hubs Work Best**
   - Helsinki (Finnair)
   - Zurich (SWISS)
   - Frankfurt (Lufthansa)
   - Amsterdam (KLM)
   - Istanbul (Turkish)

5. **Book Early**
   - 8-12 weeks before = best prices for intercontinental
   - Too early (>6 months) or too late (<3 weeks) = higher prices

## Troubleshooting

### No Results Showing
```bash
# Check AI configuration
npm run config:show

# Make sure Claude is configured (works best for complex searches)
npm run config set-all claude
```

### JSON Parse Errors
The AI sometimes generates imperfect JSON. The system will still show:
- Price analysis
- Booking strategy
- Recommendations

Just re-run the search if needed.

### Different Dates Than Requested
The AI searches ±3 days automatically to find better deals.
Look for "FLEXIBLE" tags to see which dates were adjusted.

## Next Steps

1. **Review the results** from your search
2. **Compare Finnair (€1,195)** vs **SWISS (€1,089)**
3. **Check if May 6-29 or May 9-26 dates work for you**
4. **Set price alerts** at €950 for notifications
5. **Monitor for 2-3 weeks** before booking
6. **Book when price drops** or if it rises above €1,200

## Questions?

- Full docs: `README.md`
- Commands: `COMMANDS.md`
- Configuration: `AGENT_CONFIG.md`
