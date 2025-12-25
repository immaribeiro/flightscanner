# FlightScanner - Multi-Agent AI Flight Price Comparison

## 🎯 Project Overview

A sophisticated flight price comparison system powered by multiple AI agents (ChatGPT and Claude) working collaboratively to find the best flight deals across multiple platforms.

## ✨ Key Features

- **Multi-Agent Architecture**: 4 specialized AI agents working in parallel
  - Orchestrator (Claude 3.5 Sonnet)
  - Search Agent (GPT-4 Turbo)
  - Price Analyzer (Claude 3.5 Sonnet)
  - Strategy Agent (GPT-4 Turbo)

- **Multiple Data Sources**:
  - Skyscanner
  - Momondo
  - Google Flights
  - Direct airline websites

- **Intelligent Analysis**:
  - Price comparison across platforms
  - Value proposition analysis
  - Booking strategy recommendations
  - Alternative date suggestions
  - Hidden fee detection

## 🚀 Quick Start

```bash
# 1. Setup
./setup.sh

# 2. Add your API keys to .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# 3. Run demo
npm start

# 4. Or use CLI
npm run cli -- search --from NYC --to London --depart 2024-03-15 --return 2024-03-22
```

## 📁 Project Structure

```
flightscanner/
├── src/
│   ├── agents/              # AI agent implementations
│   │   ├── BaseAgent.js
│   │   ├── OrchestratorAgent.js
│   │   ├── SearchAgent.js
│   │   ├── PriceAnalyzerAgent.js
│   │   └── StrategyAgent.js
│   ├── scrapers/            # Website scrapers
│   ├── utils/               # Utilities
│   ├── index.js             # Main FlightScanner class
│   └── cli.js               # Command-line interface
├── tests/                   # Test files
├── config/                  # Configuration
├── examples.js              # Usage examples
└── docs/
    ├── README.md            # Project overview
    ├── ARCHITECTURE.md      # System architecture
    ├── API.md               # API documentation
    └── QUICKSTART.md        # Getting started guide
```

## 🔧 Technology Stack

- **AI Models**: OpenAI GPT-4, Anthropic Claude 3.5
- **Runtime**: Node.js (ES Modules)
- **Web Scraping**: Playwright, Axios, Cheerio
- **CLI**: Commander.js
- **Testing**: Node.js built-in test runner

## 💡 How It Works

1. **User inputs** flight search criteria (origin, destination, dates)
2. **Orchestrator Agent** parses and structures the request
3. **Search Agent** queries multiple flight platforms in parallel
4. **Price Analyzer** compares prices and identifies best deals
5. **Strategy Agent** provides booking recommendations
6. **Orchestrator** synthesizes all results into clear recommendations

## 📊 Agent Workflow

```
User Request
     ↓
Orchestrator (Parse & Structure)
     ↓
┌────┴────┬─────────┐
↓         ↓         ↓
Search  Price   Strategy
Agent   Analyzer  Agent
     ↓         ↓         ↓
└────┬────┴─────────┘
     ↓
Orchestrator (Synthesize)
     ↓
Final Recommendations
```

## 🎮 Usage Examples

### Programmatic
```javascript
import FlightScanner from './src/index.js';

const scanner = new FlightScanner();
const results = await scanner.findFlights(
  "NYC to London, March 15-22, economy"
);
```

### Command Line
```bash
# Basic search
node src/cli.js search --from NYC --to London --depart 2024-03-15

# Interactive mode
node src/cli.js interactive
```

## 🔮 Future Enhancements

- [ ] Real API integrations (Skyscanner API, Amadeus, etc.)
- [ ] Playwright browser automation for dynamic content
- [ ] Price tracking and alerts
- [ ] Historical price data analysis
- [ ] Multi-city itineraries
- [ ] Mobile app
- [ ] Email/SMS notifications
- [ ] Integration with calendar apps

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Development mode (auto-reload)
npm run dev

# Run examples
npm run examples
```

## �� Available Scripts

- `npm start` - Run demo with example search
- `npm run cli` - Run CLI tool
- `npm run examples` - Run usage examples
- `npm test` - Run tests
- `npm run dev` - Development mode with auto-reload

## 🔐 Environment Variables

Required:
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key

Optional:
- `MAX_CONCURRENT_REQUESTS` - Rate limit (default: 5)
- `REQUEST_DELAY_MS` - Delay between requests (default: 1000)
- `LOG_LEVEL` - Logging level (default: info)

## �� Documentation

- **README.md** - Project overview and features
- **QUICKSTART.md** - Getting started guide
- **ARCHITECTURE.md** - System design and agent responsibilities
- **API.md** - Complete API reference and examples
- **PROJECT_SUMMARY.md** - This file

## 🤝 Why Multi-Agent Architecture?

1. **Specialization** - Each agent excels at specific tasks
2. **Parallel Processing** - Agents work simultaneously for speed
3. **Fault Tolerance** - System continues if one agent fails
4. **Scalability** - Easy to add new agents or capabilities
5. **Model Selection** - Use optimal AI model for each task
6. **Maintainability** - Clean, modular design

## ⚡ Performance

- Average search time: 10-30 seconds
- Concurrent agent execution
- Intelligent rate limiting
- Result caching (30 minutes)

## 📄 License

MIT License

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Anthropic for Claude API
- Flight booking platforms for inspiration

---

Built with ❤️ using multiple AI agents working in harmony
