import { GPTAgent } from './BaseAgent.js';

export class StrategyAgent extends GPTAgent {
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

    super('StrategyAgent', systemPrompt);
  }

  async strategize(searchParams, priceAnalysis) {
    console.log(`\n🎲 ${this.name}: Developing booking strategy...`);
    
    const prompt = `Develop a booking strategy based on:

SEARCH PARAMETERS:
${JSON.stringify(searchParams, null, 2)}

PRICE ANALYSIS:
${JSON.stringify(priceAnalysis, null, 2)}

Provide:
1. Should user book now or wait?
2. Alternative dates that might be cheaper
3. Best day of week to book/fly
4. Seasonal pricing insights
5. Risk assessment of waiting for lower prices`;

    const response = await this.execute(prompt);
    console.log(`✓ ${this.name}: Strategy developed`);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      return { strategy: response.content, structured: false };
    }
  }
}
