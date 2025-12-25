import { GPTAgent } from './BaseAgent.js';

export class SearchAgent extends GPTAgent {
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

    super('SearchAgent', systemPrompt);
  }

  async search(searchParams) {
    console.log(`\n🔍 ${this.name}: Searching flights across platforms...`);
    
    const prompt = `Search for flights with these parameters:
${JSON.stringify(searchParams, null, 2)}

Simulate searching across Skyscanner, Momondo, and Google Flights.
Generate realistic flight options with varying prices, times, and airlines.
Include direct flights and options with layovers.

Return structured JSON data with at least 5-10 flight options from each source.`;

    const response = await this.execute(prompt);
    console.log(`✓ ${this.name}: Search completed`);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      return { source: 'multiple', flights: [], raw: response.content };
    }
  }
}
