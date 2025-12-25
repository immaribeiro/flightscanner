# FlightScanner API Documentation

## Installation

```bash
git clone <your-repo-url>
cd flightscanner
./setup.sh
```

## Configuration

Edit `.env`:
```env
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## Usage

### 1. Programmatic Usage

```javascript
import FlightScanner from './src/index.js';

const scanner = new FlightScanner();

const request = `
  Find flights from New York to London
  March 15-22, 2024
  1 passenger, economy
`;

const results = await scanner.findFlights(request);
console.log(results);
```

### 2. Command Line Interface

#### Basic Search
```bash
node src/cli.js search \
  --from "New York" \
  --to "London" \
  --depart "2024-03-15" \
  --return "2024-03-22"
```

#### One-Way Flight
```bash
node src/cli.js search \
  --from "LAX" \
  --to "JFK" \
  --depart "2024-03-20"
```

#### With Options
```bash
node src/cli.js search \
  --from "San Francisco" \
  --to "Tokyo" \
  --depart "2024-04-01" \
  --return "2024-04-10" \
  --passengers 2 \
  --class business
```

#### Interactive Mode
```bash
node src/cli.js interactive
```

### 3. NPM Scripts

```bash
# Run demo
npm start

# Run CLI
npm run cli -- search --from NYC --to LON --depart 2024-03-15

# Run examples
npm run examples

# Run tests
npm test

# Development mode (auto-reload)
npm run dev
```

## API Reference

### FlightScanner Class

#### Constructor
```javascript
const scanner = new FlightScanner();
```

Creates a new FlightScanner instance with all agents initialized.

#### Methods

##### findFlights(userRequest)
Main search method that coordinates all agents.

**Parameters:**
- `userRequest` (string): Natural language flight search request

**Returns:** Promise<Object>
```javascript
{
  searchParams: {
    origin: string,
    destination: string,
    departDate: string,
    returnDate: string,
    passengers: number,
    class: string
  },
  searchResults: Object,
  priceAnalysis: Object,
  strategy: Object,
  finalRecommendation: string
}
```

**Example:**
```javascript
const results = await scanner.findFlights(
  "NYC to London, March 15-22, economy"
);
```

### Agent Classes

#### OrchestratorAgent

**Methods:**
- `orchestrate(userRequest)`: Parses and structures user input
- `synthesize(searchResults, analysisResults, strategyResults)`: Combines all agent outputs

#### SearchAgent

**Methods:**
- `search(searchParams)`: Searches flight platforms

#### PriceAnalyzerAgent

**Methods:**
- `analyze(flightData)`: Analyzes prices and identifies deals

#### StrategyAgent

**Methods:**
- `strategize(searchParams, priceAnalysis)`: Provides booking recommendations

## Response Format

### Search Results
```javascript
{
  source: "platform_name",
  flights: [
    {
      airline: "Airline Name",
      price: 450.00,
      currency: "USD",
      departure: "2024-03-15T08:00:00Z",
      arrival: "2024-03-15T20:00:00Z",
      duration: 720, // minutes
      stops: 0,
      link: "https://booking-url.com"
    }
  ]
}
```

### Price Analysis
```javascript
{
  bestPrice: {
    amount: 450.00,
    source: "Skyscanner",
    flightId: "ABC123"
  },
  priceRange: {
    min: 450.00,
    max: 850.00,
    average: 625.00
  },
  recommendations: [
    "Best deal found on Skyscanner",
    "Price is 15% below average"
  ],
  warnings: [
    "No checked baggage included",
    "Non-refundable fare"
  ]
}
```

### Strategy Recommendations
```javascript
{
  bookingRecommendation: "book_now",
  reasoning: "Prices typically rise 2 weeks before departure",
  alternativeDates: [
    {
      departDate: "2024-03-16",
      returnDate: "2024-03-23",
      estimatedSavings: "$75"
    }
  ],
  tips: [
    "Tuesday and Wednesday departures are usually cheaper",
    "Consider nearby airports"
  ],
  priceAlerts: {
    setup: true,
    targetPrice: 400.00
  }
}
```

## Error Handling

All methods throw descriptive errors:

```javascript
try {
  const results = await scanner.findFlights(request);
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('Check your .env configuration');
  } else if (error.message.includes('rate limit')) {
    console.error('Too many requests, please wait');
  } else {
    console.error('Search failed:', error.message);
  }
}
```

## Rate Limiting

The system includes built-in rate limiting:
- Max 5 requests per second per platform
- Automatic retry with exponential backoff
- Configurable in `config/default.json`

## Extending the System

### Adding a New Agent

1. Create agent class:
```javascript
import { GPTAgent } from './BaseAgent.js';

export class NewAgent extends GPTAgent {
  constructor() {
    super('NewAgent', 'Your system prompt here');
  }

  async doTask(params) {
    const response = await this.execute(`Task: ${params}`);
    return JSON.parse(response.content);
  }
}
```

2. Register in FlightScanner:
```javascript
constructor() {
  // ... existing agents
  this.newAgent = new NewAgent();
}
```

### Adding a New Scraper

1. Create scraper:
```javascript
export class NewPlatformScraper {
  async searchFlights(origin, destination, date) {
    // Your scraping logic
    return { source: 'NewPlatform', flights: [...] };
  }
}
```

2. Use in SearchAgent

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4 |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude |
| `MAX_CONCURRENT_REQUESTS` | No | Rate limit (default: 5) |
| `REQUEST_DELAY_MS` | No | Delay between requests (default: 1000) |
| `LOG_LEVEL` | No | Logging level (default: info) |

## Troubleshooting

### "API key not found"
- Check `.env` file exists
- Verify API keys are correct
- Ensure no extra spaces in keys

### "Rate limit exceeded"
- Wait 60 seconds
- Reduce `MAX_CONCURRENT_REQUESTS` in `.env`

### "No flights found"
- Check date format (YYYY-MM-DD)
- Verify airport codes are valid
- Try broader search criteria

## Performance

- Average search time: 10-30 seconds
- Concurrent agent execution
- Results cached for 30 minutes
- Supports up to 50 results per search

## Limitations

Current version limitations:
- Simulated flight data (for demo)
- No real-time price tracking
- Limited to round-trip and one-way flights
- English language only

Future enhancements planned:
- Real API integrations
- Multi-city itineraries
- Price tracking and alerts
- Historical data analysis
- International language support

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## License

MIT License - see LICENSE file for details
