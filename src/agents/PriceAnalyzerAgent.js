import { createAgent } from './BaseAgent.js';

export class PriceAnalyzerAgent {
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

    this.agent = createAgent('priceAnalyzer', 'PriceAnalyzer', systemPrompt);
    this.name = this.agent.name;
  }

  async execute(prompt) {
    return this.agent.execute(prompt);
  }

  async analyze(flightData) {
    console.log(`\n💰 ${this.name}: Analyzing prices and value...`);
    
    const prompt = `Analyze these flight search results:
${JSON.stringify(flightData, null, 2)}

Respond with ONLY valid JSON (no other text):
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
  "recommendations": ["insight 1", "insight 2"],
  "warnings": ["warning 1", "warning 2"]
}`;

    const response = await this.execute(prompt);
    console.log(`✓ ${this.name}: Analysis completed`);
    
    try {
      let jsonStr = response.content.trim();
      const jsonMatch = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) jsonStr = jsonMatch[1];
      if (!jsonStr.startsWith('{')) {
        const objMatch = jsonStr.match(/(\{[\s\S]*\})/);
        if (objMatch) jsonStr = objMatch[1];
      }
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Price analyzer JSON parse error:', error.message);
      return { analysis: response.content, structured: false };
    }
  }
}
