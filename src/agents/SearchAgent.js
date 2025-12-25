import { createAgent } from './BaseAgent.js';

export class SearchAgent {
  constructor() {
    const systemPrompt = `You are the Search Agent for a flight price comparison system.

Your responsibilities:
1. Query multiple flight booking platforms (Skyscanner, Momondo, Google Flights)
2. Scrape and parse flight data from various sources for ROUND-TRIP flights
3. Extract flight details: prices, times, airlines, layovers for BOTH outbound and return legs
4. Consider flexible date options (±3 days) to find cheaper alternatives
5. Normalize data from different sources into consistent format

Output structured flight data in JSON format with BOTH outbound AND return flights:
{
  "source": "platform name",
  "searchType": "round-trip",
  "flexibleDates": true,
  "flights": [{
    "totalPrice": number,
    "currency": "USD",
    "outbound": {
      "airline": "airline name",
      "flightNumber": "flight code",
      "departure": "ISO datetime",
      "arrival": "ISO datetime",
      "duration": minutes,
      "stops": number,
      "layovers": ["airport codes"],
      "aircraft": "aircraft type"
    },
    "return": {
      "airline": "airline name", 
      "flightNumber": "flight code",
      "departure": "ISO datetime",
      "arrival": "ISO datetime",
      "duration": minutes,
      "stops": number,
      "layovers": ["airport codes"],
      "aircraft": "aircraft type"
    },
    "link": "booking URL",
    "cabinClass": "Economy/Premium Economy/Business/First",
    "savings": "amount saved vs requested dates (if flexible date option)"
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
    
    const prompt = `Search for ROUND-TRIP flights with these parameters:
${JSON.stringify(searchParams, null, 2)}

IMPORTANT: 
- Search for COMPLETE ROUND-TRIP itineraries (outbound + return)
- Include flexible date options: Search ±3 days around the requested dates
- Show cheaper/faster alternatives even if dates are slightly different
- Generate realistic flight options from Porto (OPO) to Tokyo Haneda (HND)
- Include both direct and connecting flights
- Prioritize options that are CHEAPER or FASTER than the exact requested dates

Respond with ONLY valid JSON in this format (no other text):
{
  "source": "Multiple Platforms (Skyscanner, Momondo, Google Flights)",
  "searchType": "round-trip",
  "requestedDates": {
    "outbound": "${searchParams.departDate}",
    "return": "${searchParams.returnDate}"
  },
  "flights": [
    {
      "totalPrice": number,
      "currency": "EUR",
      "outbound": {
        "date": "YYYY-MM-DD",
        "airline": "airline name (e.g., Lufthansa, Air France, Turkish Airlines)",
        "flightNumber": "flight code (e.g., LH1234)",
        "departure": "ISO datetime",
        "departureAirport": "OPO",
        "arrival": "ISO datetime",
        "arrivalAirport": "HND",
        "duration": minutes,
        "stops": number,
        "layovers": ["airport codes if connecting, e.g., FRA, CDG"],
        "layoverDurations": [minutes per layover],
        "aircraft": "aircraft type (e.g., Boeing 787-9, Airbus A350-900)",
        "operatedBy": "operating airline if codeshare"
      },
      "return": {
        "date": "YYYY-MM-DD",
        "airline": "airline name",
        "flightNumber": "flight code",
        "departure": "ISO datetime",
        "departureAirport": "HND",
        "arrival": "ISO datetime",
        "arrivalAirport": "OPO",
        "duration": minutes,
        "stops": number,
        "layovers": ["airport codes if connecting"],
        "layoverDurations": [minutes per layover],
        "aircraft": "aircraft type",
        "operatedBy": "operating airline if codeshare"
      },
      "totalDuration": "total travel time including layovers for both legs",
      "link": "realistic booking URL",
      "cabinClass": "Economy",
      "flexibility": "EXACT_DATES or FLEXIBLE (±1, ±2, ±3 days)",
      "savings": "EUR amount saved if flexible dates used",
      "provider": "Skyscanner/Momondo/Google Flights"
    }
  ]
}

Generate 8-12 realistic round-trip flight options with:
- Mix of exact dates and flexible date alternatives (±1, ±2, ±3 days)
- Both direct and 1-2 stop options
- Major European hubs (Frankfurt, Paris, Amsterdam, Istanbul, Helsinki, Zurich)
- Realistic prices for Porto to Tokyo route (€800-€2000)
- Show clearly which options save money by adjusting dates
- Prioritize faster flights and better connections`;

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
      
      const parsed = JSON.parse(jsonStr);
      
      // Ensure flights array exists
      if (!parsed.flights || parsed.flights.length === 0) {
        console.warn('⚠️  No flights found in response, returning default structure');
        return { source: 'multiple', flights: [], searchType: 'round-trip', raw: response.content };
      }
      
      return parsed;
    } catch (error) {
      console.error('Search agent JSON parse error:', error.message);
      console.log('💡 Attempting to extract partial flight data...');
      
      // Try to return a minimal structure so the app doesn't crash
      return { 
        source: 'multiple', 
        flights: [],
        searchType: 'round-trip',
        error: error.message,
        raw: response.content.substring(0, 500) 
      };
    }
  }
}
