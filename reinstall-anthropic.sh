#!/bin/bash

echo "🔄 Removing old Anthropic SDK..."
rm -rf node_modules/@anthropic-ai

echo "📦 Installing latest Anthropic SDK..."
npm install @anthropic-ai/sdk@latest

echo ""
echo "✅ Testing SDK..."
node test-anthropic.js

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "If test passed, run your search:"
echo "  node src/cli.js search --from Porto --to Tokyo --depart 2026-05-07 --return 2026-05-27"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
