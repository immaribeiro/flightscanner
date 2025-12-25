# Agent Configuration Guide

FlightScanner now supports selecting which AI provider to use for each agent role! You can mix and match Claude, OpenAI GPT-4, and GitHub Copilot Pro based on your API keys and preferences.

## Quick Start

### 1. View Current Configuration

```bash
npm run config:show
```

This shows which AI provider is assigned to each agent and which API keys are configured.

### 2. Configure Your API Keys

You have two options:

#### Option A: Interactive Setup (Recommended)
```bash
npm run config setup
```

This will guide you through entering your API keys interactively.

#### Option B: Manual Setup
Edit your `.env` file:

```env
OPENAI_API_KEY=sk-proj-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GITHUB_TOKEN=ghp_your-github-token-here
```

### 3. Select Agents

Configure which AI provider each agent uses:

```bash
# Set individual agents
npm run config set orchestrator claude
npm run config set search openai
npm run config set priceAnalyzer claude
npm run config set strategy copilot

# Or set all agents to the same provider
npm run config set-all claude
npm run config set-all openai
npm run config set-all copilot
```

## Agent Roles

The FlightScanner system has 4 agent roles:

1. **Orchestrator** - Coordinates all agents and synthesizes results
2. **Search** - Searches for flights across platforms
3. **PriceAnalyzer** - Analyzes and compares prices
4. **Strategy** - Provides booking strategy and timing recommendations

## Available AI Providers

### Claude (Anthropic)
- **Model**: claude-sonnet-4-20250514
- **Best for**: Complex reasoning, analysis, synthesis
- **API Key**: `ANTHROPIC_API_KEY`

### OpenAI GPT-4
- **Model**: gpt-4o
- **Best for**: General purpose, creative responses
- **API Key**: `OPENAI_API_KEY`

### GitHub Copilot Pro
- **Model**: gpt-4o (via Copilot API)
- **Best for**: Code-aware responses, developer workflows
- **API Key**: `GITHUB_TOKEN`

## Configuration Methods

### Method 1: Environment Variables (Highest Priority)

Set these in your `.env` file:
```env
ORCHESTRATOR_AGENT=claude
SEARCH_AGENT=openai
PRICE_ANALYZER_AGENT=claude
STRATEGY_AGENT=copilot
```

### Method 2: Config File

Edit `config/default.json`:
```json
{
  "agentAssignments": {
    "orchestrator": "claude",
    "search": "openai",
    "priceAnalyzer": "claude",
    "strategy": "openai"
  }
}
```

### Method 3: CLI Tool

Use the configuration CLI:
```bash
# Show current config
npm run config show

# Set specific agent
npm run config set orchestrator claude
npm run config set search openai

# Set all agents at once
npm run config set-all claude
```

## Recommended Configurations

### Budget-Friendly (Single Provider)
Use only one provider to minimize API costs:
```bash
npm run config set-all openai
# or
npm run config set-all claude
```

### Balanced Performance
Mix providers based on their strengths:
```bash
npm run config set orchestrator claude    # Complex reasoning
npm run config set search openai          # Fast search
npm run config set priceAnalyzer claude   # Detailed analysis
npm run config set strategy openai        # Creative suggestions
```

### Copilot-First
If you have GitHub Copilot Pro:
```bash
npm run config set-all copilot
```

## Validation

The system automatically validates that you have the required API keys for your selected providers. If keys are missing, you'll see an error message when starting the scanner.

## Examples

### Check Configuration
```bash
npm run config:show
```

Output:
```
╔═══════════════════════════════════════════════════════╗
║          Current Agent Configuration                 ║
╚═══════════════════════════════════════════════════════╝

Agent Roles:
  🎯 Orchestrator:    CLAUDE
  🔍 Search Agent:    OPENAI
  💰 Price Analyzer:  CLAUDE
  🎲 Strategy Agent:  OPENAI

Available API Keys:
  ✓ OpenAI:    ✓ Configured
  ✓ Claude:    ✓ Configured
  ✓ Copilot:   ✗ Missing
```

### Change Single Agent
```bash
npm run config set search copilot
```

Output:
```
✓ Updated search agent to use COPILOT
```

### Run with Configuration
```bash
npm start
```

The system will display the active configuration when starting.

## Troubleshooting

### Missing API Keys
If you see: `❌ Missing required API keys`

1. Check your `.env` file exists
2. Verify the keys are correctly formatted
3. Run `npm run config setup` to reconfigure

### Invalid Provider
If you see: `❌ Invalid provider`

Valid provider names:
- `claude` or `anthropic`
- `openai` or `gpt`
- `copilot` or `github`

### Configuration Not Applied
Priority order:
1. Environment variables in `.env`
2. Config file `config/default.json`
3. Default values

## Support

For issues or questions:
- Check the main README.md
- Review configuration examples
- Validate API keys are active
