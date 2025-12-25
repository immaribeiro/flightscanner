#!/bin/bash

# FlightScanner - Quick API Key Setup Script
# Usage: ./update-keys.sh

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║            FlightScanner - API Key Setup                         ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Prompt for OpenAI key
echo "📝 Enter your OpenAI API key (starts with sk-...):"
read -r OPENAI_KEY

# Prompt for Anthropic key
echo ""
echo "📝 Enter your Anthropic API key (starts with sk-ant-...):"
read -r ANTHROPIC_KEY

# Validate keys are not empty
if [ -z "$OPENAI_KEY" ] || [ -z "$ANTHROPIC_KEY" ]; then
    echo ""
    echo "❌ Error: Both API keys are required!"
    exit 1
fi

# Update .env file
echo ""
echo "📝 Updating .env file..."

# Use sed to replace the placeholder values
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$OPENAI_KEY|g" .env
    sed -i '' "s|ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=$ANTHROPIC_KEY|g" .env
else
    # Linux
    sed -i "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$OPENAI_KEY|g" .env
    sed -i "s|ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=$ANTHROPIC_KEY|g" .env
fi

echo ""
echo "✅ API keys updated successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 You can now run:"
echo "   npm start          # Run with real AI agents"
echo "   npm run demo       # Run demo mode"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
