#!/bin/bash

# FlightScanner - Fix Anthropic API Issue
# This script fixes the "Cannot read properties of undefined" error

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║          Fixing Anthropic API Configuration                     ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

echo "📦 Step 1: Reinstalling dependencies..."
npm install

echo ""
echo "🔧 Step 2: Testing Anthropic SDK..."
node test-anthropic.js

echo ""
echo "✅ If the test passed, try running your search again:"
echo "   node src/cli.js search --from \"Porto\" --to \"Tokyo\" --depart \"2026-05-07\" --return \"2026-05-27\""
echo ""
