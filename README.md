# FlightScanner - Multi-Agent Flight Price Comparison System

An intelligent flight price comparison system powered by multiple AI agents working collaboratively to find the best flight deals.

## Features

- **Multi-Agent Architecture**: Specialized AI agents for different tasks
  - Orchestrator Agent: Coordinates all agents and synthesizes results
  - Search Agent: Queries multiple flight booking websites
  - Price Analyzer Agent: Analyzes and compares prices across sources
  - Strategy Agent: Suggests best booking strategies and timing
  
- **Multiple Data Sources**:
  - Skyscanner API integration
  - Momondo scraping
  - Direct airline website checks
  - Google Flights integration
  
- **AI Providers**:
  - OpenAI (ChatGPT) API
  - Anthropic Claude API
  - GitHub Copilot integration for code assistance

## Architecture

```
User Input (dates, cities)
        ↓
Orchestrator Agent (Claude)
        ↓
    ┌───┴───┬───────────┐
    ↓       ↓           ↓
Search   Price      Strategy
Agent    Analyzer    Agent
(GPT)    (Claude)    (GPT)
    ↓       ↓           ↓
    └───┬───┴───────────┘
        ↓
   Results Synthesis
        ↓
User Recommendations
```

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd flightscanner

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env
```

## Configuration

Create a `.env` file with:

```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GITHUB_TOKEN=your_github_token (optional)
```

## Usage

```bash
# Start the flight scanner
node src/index.js

# Or use the CLI
node src/cli.js --from "New York" --to "London" --depart "2024-03-15" --return "2024-03-22"
```

## Project Structure

```
flightscanner/
├── src/
│   ├── agents/          # AI agent implementations
│   ├── scrapers/        # Website scrapers
│   ├── services/        # API integrations
│   ├── utils/           # Utilities
│   └── index.js         # Main entry point
├── tests/
├── config/
└── package.json
```

## License

MIT
