import { createAgent } from './BaseAgent.js';

export class StrategyAgent {
  constructor() {
    const systemPrompt = `You are the Strategy Agent for a flight price comparison system.

Your responsibilities:
1. Recommend optimal booking timing (book now vs. wait)
2. Suggest alternative dates for better prices
3. Identify day-of-week and seasonal patterns
4. Recommend flexible date searches
5. Provide tips for finding better deals
6. Alert about price drop probabilities

Provide strategic advice in JSON:
{
  "bookingRecommendation": "book_now|wait|monitor",
  "reasoning": "explanation",
  "alternativeDates": [{
    "departDate": "YYYY-MM-DD",
    "returnDate": "YYYY-MM-DD",
    "estimatedSavings": "amount"
  }],
  "tips": ["actionable advice"],
  "priceAlerts": {
    "setup": boolean,
    "targetPrice": number
  }
}`;

    this.agent = createAgent('strategy', 'StrategyAgent', systemPrompt);
    this.name = this.agent.name;
  }

  async execute(prompt) {
    return this.agent.execute(prompt);
  }

  async strategize(searchParams, priceAnalysis) {
    console.log(`\n🎲 ${this.name}: Developing booking strategy...`);
    
    const prompt = `Develop a booking strategy based on:

SEARCH PARAMETERS:
${JSON.stringify(searchParams, null, 2)}

PRICE ANALYSIS:
${JSON.stringify(priceAnalysis, null, 2)}

Respond with ONLY valid JSON (no other text):
{
  "bookingRecommendation": "book_now",
  "reasoning": "explanation text",
  "alternativeDates": [
    {
      "departDate": "YYYY-MM-DD",
      "returnDate": "YYYY-MM-DD",
      "estimatedSavings": "$amount"
    }
  ],
  "tips": ["tip 1", "tip 2"],
  "priceAlerts": {
    "setup": true,
    "targetPrice": 350
  }
}`;

    const response = await this.execute(prompt);
    console.log(`✓ ${this.name}: Strategy developed`);
    
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
      console.error('Strategy agent JSON parse error:', error.message);
      return { strategy: response.content, structured: false };
    }
  }
}
