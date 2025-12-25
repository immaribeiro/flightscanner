import { ClaudeAgent } from './BaseAgent.js';

export class PriceAnalyzerAgent extends ClaudeAgent {
  constructor() {
    const systemPrompt = `You are the Price Analyzer Agent for a flight price comparison system.

Your responsibilities:
1. Compare prices across different booking platforms
2. Identify the best deals and value propositions
3. Detect price anomalies and unusually good deals
4. Calculate price per hour of flight time
5. Consider additional factors (baggage, seat selection, flexibility)
6. Flag hidden fees and fare restrictions

Provide analysis in JSON format:
{
  "bestPrice": {
    "amount": number,
    "source": "platform",
    "flightId": "id"
  },
  "priceRange": {
    "min": number,
    "max": number,
    "average": number
  },
  "recommendations": ["insights"],
  "warnings": ["potential issues"]
}`;

    super('PriceAnalyzer', systemPrompt);
  }

  async analyze(flightData) {
    console.log(`\n💰 ${this.name}: Analyzing prices and value...`);
    
    const prompt = `Analyze these flight search results:
${JSON.stringify(flightData, null, 2)}

Provide:
1. Best value options (not just cheapest)
2. Price comparison across sources
3. Value analysis (price vs. convenience)
4. Warnings about restrictions or hidden costs
5. Price trends if detectable`;

    const response = await this.execute(prompt);
    console.log(`✓ ${this.name}: Analysis completed`);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      return { analysis: response.content, structured: false };
    }
  }
}
