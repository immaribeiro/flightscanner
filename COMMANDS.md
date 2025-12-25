# FlightScanner Commands

## Configuration Commands

### View Current Configuration
```bash
npm run config:show
```
Shows which AI provider is assigned to each agent role and which API keys are available.

### Interactive Setup
```bash
npm run config setup
```
Guided wizard to enter your API keys (OpenAI, Claude, GitHub Token).

### Set Individual Agent
```bash
npm run config set <agent> <provider>
```

Examples:
```bash
npm run config set orchestrator claude
npm run config set search openai
npm run config set priceAnalyzer copilot
npm run config set strategy claude
```

### Set All Agents
```bash
npm run config set-all <provider>
```

Examples:
```bash
npm run config set-all claude      # Use Claude for all agents
npm run config set-all openai      # Use OpenAI for all agents
npm run config set-all copilot     # Use GitHub Copilot for all agents
```

## Running the Scanner

### Start the Scanner
```bash
npm start
```
Runs the main flight scanner with your configured agents.

### Run Demo
```bash
npm run demo
```
Runs a demo flight search.

### Run CLI
```bash
npm run cli
```
Interactive command-line interface for searching flights.

### Run Examples
```bash
npm run examples
```
Shows example usage of the system.

### Development Mode
```bash
npm run dev
```
Runs the scanner with auto-reload on file changes.

## Testing

### Run Tests
```bash
npm test
```
Runs the test suite.

## Quick Configuration Scenarios

### Scenario 1: I only have OpenAI API key
```bash
npm run config set-all openai
npm start
```

### Scenario 2: I only have Claude API key
```bash
npm run config set-all claude
npm start
```

### Scenario 3: I only have GitHub Copilot Pro
```bash
npm run config set-all copilot
npm start
```

### Scenario 4: I have all three, want optimal performance
```bash
npm run config set orchestrator claude
npm run config set search openai
npm run config set priceAnalyzer claude
npm run config set strategy openai
npm start
```

### Scenario 5: Change my mind, switch everything to Claude
```bash
npm run config set-all claude
npm start
```

## Agent Types

- `orchestrator` - Coordinates all agents and synthesizes results
- `search` - Searches for flights across platforms
- `priceAnalyzer` - Analyzes and compares prices
- `strategy` - Provides booking strategy recommendations

## Provider Names

- `claude` or `anthropic` - Anthropic Claude AI
- `openai` or `gpt` - OpenAI GPT-4
- `copilot` or `github` - GitHub Copilot Pro

## Environment Variables (.env)

```env
# Required: At least one API key
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_TOKEN=ghp_...

# Optional: Override config file
ORCHESTRATOR_AGENT=claude
SEARCH_AGENT=openai
PRICE_ANALYZER_AGENT=claude
STRATEGY_AGENT=openai
```

## Help

For more details:
- Configuration Guide: `cat AGENT_CONFIG.md`
- Quick Reference: `cat CONFIG_QUICKREF.md`
- Implementation Summary: `cat IMPLEMENTATION_SUMMARY.md`
- Main README: `cat README.md`
