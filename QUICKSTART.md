# FlightScanner Project

## Quick Start

1. **Setup**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Add API Keys**
   Edit `.env` and add your keys:
   ```
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Run**
   ```bash
   # Demo mode
   npm start

   # CLI mode
   npm run cli -- search --from "New York" --to "London" --depart "2024-03-15" --return "2024-03-22"

   # Interactive mode
   node src/cli.js interactive
   ```

## Architecture Overview

This system uses 4 specialized AI agents:

1. **Orchestrator Agent (Claude)** - Coordinates all agents and synthesizes results
2. **Search Agent (GPT-4)** - Queries flight platforms and extracts data
3. **Price Analyzer Agent (Claude)** - Analyzes prices and identifies best deals
4. **Strategy Agent (GPT-4)** - Provides booking strategies and timing advice

Each agent specializes in different tasks, working together to provide comprehensive flight recommendations.

## Features

- Multi-agent AI collaboration
- Multiple data source integration (Skyscanner, Momondo, Google Flights, airlines)
- Intelligent price analysis
- Booking strategy recommendations
- CLI and interactive modes

## Development

```bash
# Run tests
npm test

# Watch mode
npm run dev
```

## Future Enhancements

- [ ] Real API integrations for flight data
- [ ] Playwright browser automation for scraping
- [ ] Price tracking and alerts
- [ ] Historical price data analysis
- [ ] Mobile app interface
- [ ] Email/SMS notifications
- [ ] Multi-city and complex itineraries
