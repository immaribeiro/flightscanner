import { createAgent } from './BaseAgent.js';

export class SearchAgent {
  constructor() {
    const systemPrompt = `You are the Search Agent for a flight price comparison system.

Your responsibilities:
1. Query multiple flight booking platforms (Skyscanner, Momondo, Google Flights)
2. Scrape and parse flight data from various sources
3. Extract flight details: prices, times, airlines, layovers
4. Normalize data from different sources into consistent format
5. Handle rate limiting and retries

Output structured flight data in JSON format:
{
  "source": "platform name",
  "flights": [{
    "airline": "airline name",
    "price": number,
    "currency": "USD",
    "departure": "ISO datetime",
    "arrival": "ISO datetime", 
    "duration": "minutes",
    "stops": number,
    "link": "booking URL"
  }]
}`;

    this.agent = createAgent('search', 'SearchAgent', systemPrompt);
    this.name = this.agent.name;
  }

  async execute(prompt) {
    return this.agent.execute(prompt);
  }

  async search(searchParams) {
    console.log(`\n🔍 ${this.name}: Searching flights across platforms...`);
    
    const prompt = `Search for flights with these parameters:
${JSON.stringify(searchParams, null, 2)}

Simulate searching across Skyscanner, Momondo, and Google Flights.
Generate realistic flight options with varying prices, times, and airlines.
Include direct flights and options with layovers.

Respond with ONLY valid JSON in this format (no other text):
{
  "source": "platform name",
  "flights": [
    {
      "airline": "airline name",
      "price": number,
      "currency": "USD",
      "departure": "ISO datetime",
      "arrival": "ISO datetime",
      "duration": minutes,
      "stops": number,
      "link": "booking URL"
    }
  ]
}`;

    const response = await this.execute(prompt);
    console.log(`✓ ${this.name}: Search completed`);
    
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
      console.error('Search agent JSON parse error:', error.message);
      return { source: 'multiple', flights: [], raw: response.content };
    }
  }
}
