# Quick Configuration Reference

## View Configuration
```bash
npm run config:show
```

## Setup API Keys
```bash
npm run config setup
```

## Set Individual Agents
```bash
npm run config set orchestrator [claude|openai|copilot]
npm run config set search [claude|openai|copilot]
npm run config set priceAnalyzer [claude|openai|copilot]
npm run config set strategy [claude|openai|copilot]
```

## Set All Agents
```bash
npm run config set-all [claude|openai|copilot]
```

## Common Configurations

### All Claude
```bash
npm run config set-all claude
```

### All OpenAI
```bash
npm run config set-all openai
```

### All GitHub Copilot
```bash
npm run config set-all copilot
```

### Mixed (Recommended)
```bash
npm run config set orchestrator claude
npm run config set search openai
npm run config set priceAnalyzer claude
npm run config set strategy openai
```

## Environment Variables (.env)
```env
# API Keys (at least one required)
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_TOKEN=ghp_...

# Agent Selection (optional - overrides config file)
ORCHESTRATOR_AGENT=claude
SEARCH_AGENT=openai
PRICE_ANALYZER_AGENT=claude
STRATEGY_AGENT=openai
```

## Provider Aliases
- Claude: `claude` or `anthropic`
- OpenAI: `openai` or `gpt`
- Copilot: `copilot` or `github`

## Run the Scanner
```bash
npm start
```

The active configuration will be displayed on startup.
