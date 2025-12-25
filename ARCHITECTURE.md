# FlightScanner Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         USER INPUT                          │
│    "Find flights from NYC to London, March 15-22, 2024"    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              ORCHESTRATOR AGENT (Claude)                    │
│  • Parses request                                           │
│  • Structures search parameters                             │
│  • Coordinates other agents                                 │
│  • Synthesizes final results                                │
└──────┬──────────────────┬──────────────────┬────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ SEARCH AGENT │  │   PRICE      │  │  STRATEGY    │
│   (GPT-4)    │  │  ANALYZER    │  │    AGENT     │
│              │  │  (Claude)    │  │   (GPT-4)    │
├──────────────┤  ├──────────────┤  ├──────────────┤
│• Skyscanner  │  │• Compare     │  │• Book now/   │
│• Momondo     │  │  prices      │  │  wait?       │
│• Google      │  │• Find deals  │  │• Alternative │
│  Flights     │  │• Value       │  │  dates       │
│• Airlines    │  │  analysis    │  │• Best timing │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                  │                  │
       └──────────────────┴──────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               ORCHESTRATOR SYNTHESIS                        │
│  • Combines all agent outputs                               │
│  • Ranks options                                            │
│  • Provides clear recommendations                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    FINAL RESULTS                            │
│  1. Best flight option with justification                   │
│  2. Alternative options with pros/cons                      │
│  3. Booking strategy and timing advice                      │
│  4. Price trends and insights                               │
└─────────────────────────────────────────────────────────────┘
```

## Agent Responsibilities

### Orchestrator Agent (Claude 3.5 Sonnet)
**Primary Coordinator & Synthesizer**
- Natural language understanding of user requests
- Parameter extraction and validation
- Task delegation to specialist agents
- Result aggregation and synthesis
- Final recommendation generation

### Search Agent (GPT-4 Turbo)
**Data Collection Specialist**
- Interfaces with flight booking APIs
- Scrapes multiple platforms:
  - Skyscanner
  - Momondo
  - Google Flights
  - Direct airline websites
- Normalizes data formats
- Handles rate limiting
- Manages retries and errors

### Price Analyzer Agent (Claude 3.5 Sonnet)
**Financial Analysis Expert**
- Cross-platform price comparison
- Value proposition analysis (price vs. convenience)
- Deal identification and anomaly detection
- Hidden fee detection
- Fare restriction analysis
- Price-per-hour calculations

### Strategy Agent (GPT-4 Turbo)
**Booking Strategy Advisor**
- Optimal booking timing recommendations
- Alternative date suggestions
- Seasonal pattern identification
- Price prediction insights
- Risk assessment (book now vs. wait)
- Money-saving tips

## Data Flow

1. **Input Processing**
   ```
   User Request → Orchestrator → Structured Parameters
   ```

2. **Parallel Agent Execution**
   ```
   Search Agent    ─┐
   Price Analyzer  ─┼→ Independent parallel processing
   Strategy Agent  ─┘
   ```

3. **Result Synthesis**
   ```
   Agent Results → Orchestrator → Unified Recommendations
   ```

## Technology Stack

- **AI Models**: OpenAI GPT-4 Turbo, Anthropic Claude 3.5 Sonnet
- **Web Scraping**: Playwright (for dynamic content)
- **HTTP Client**: Axios
- **HTML Parsing**: Cheerio
- **Runtime**: Node.js (ES Modules)
- **CLI**: Commander.js

## Why Multi-Agent?

1. **Specialization**: Each agent excels at its specific task
2. **Parallel Processing**: Agents work simultaneously
3. **Fault Tolerance**: If one agent fails, others continue
4. **Scalability**: Easy to add new agents or capabilities
5. **Model Selection**: Use best AI model for each task
6. **Maintainability**: Modular, single-responsibility design
