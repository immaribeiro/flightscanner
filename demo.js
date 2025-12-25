import { FlightScanner } from './src/index.js';

// Mock data for demo mode
const mockFlightData = {
  source: 'Demo Data',
  flights: [
    {
      airline: 'United Airlines',
      price: 450,
      currency: 'USD',
      departure: '2024-03-15T08:00:00Z',
      arrival: '2024-03-15T20:00:00Z',
      duration: 720,
      stops: 0,
      link: 'https://example.com/booking1'
    },
    {
      airline: 'British Airways',
      price: 425,
      currency: 'USD',
      departure: '2024-03-15T10:30:00Z',
      arrival: '2024-03-15T22:30:00Z',
      duration: 720,
      stops: 0,
      link: 'https://example.com/booking2'
    },
    {
      airline: 'American Airlines',
      price: 380,
      currency: 'USD',
      departure: '2024-03-15T14:00:00Z',
      arrival: '2024-03-16T05:00:00Z',
      duration: 900,
      stops: 1,
      link: 'https://example.com/booking3'
    }
  ]
};

class DemoAgent {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  async execute(message) {
    console.log(`\n🤖 ${this.name} (${this.role}): Processing...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return { agent: this.name, content: this.generateResponse(), model: 'demo-mode' };
  }

  generateResponse() {
    return JSON.stringify(this.getMockResponse(), null, 2);
  }

  getMockResponse() {
    return {};
  }
}

class DemoOrchestrator extends DemoAgent {
  constructor() {
    super('Orchestrator', 'Demo Mode');
  }

  async orchestrate(userRequest) {
    console.log(`\n🎯 ${this.name}: Processing user request...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const structured = {
      searchParams: {
        origin: 'JFK',
        destination: 'LHR',
        departDate: '2024-03-15',
        returnDate: '2024-03-22',
        passengers: 1,
        class: 'economy'
      },
      taskAssignments: ['search', 'analyze', 'strategy'],
      priority: 'price'
    };
    
    console.log(`✓ ${this.name}: Request structured successfully`);
    return structured;
  }

  async synthesize(searchResults, analysisResults, strategyResults) {
    console.log(`\n🎯 ${this.name}: Synthesizing results from all agents...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recommendation = `
╔═══════════════════════════════════════════════════════════════════╗
║                    FLIGHT RECOMMENDATIONS                         ║
╚═══════════════════════════════════════════════════════════════════╝

🏆 BEST OVERALL OPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Airline: American Airlines
  Price: $380 USD
  Route: JFK → LHR (1 stop)
  Departure: March 15, 2024 at 2:00 PM
  Duration: 15h 00m
  
  ✓ Best price found across all platforms
  ✓ Good departure time
  ⚠ Has 1 layover (saves $70 vs direct flights)

💡 ALTERNATIVE OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Option 2: British Airways - $425 (Direct)
  • No layovers, arrives 2.5 hours earlier
  • Premium $45 for convenience
  
  Option 3: United Airlines - $450 (Direct)
  • Morning departure (8:00 AM)
  • Best for adjusting to time zone

📊 PRICE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Lowest Price: $380
  Average Price: $418
  Highest Price: $450
  
  Your Savings: $70 (15% below average)

🎯 BOOKING STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Recommendation: BOOK NOW
  
  Reasons:
  • Prices typically increase 2-3 weeks before departure
  • Current prices are below seasonal average
  • High demand period approaching
  
  Alternative Dates:
  • Departing March 16 (Sat): Save ~$25
  • Departing March 13 (Wed): Save ~$35
  • Mid-week flights generally cheaper

💰 MONEY-SAVING TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Consider nearby airports (EWR, LGA for NYC)
  2. Set price alerts for this route
  3. Check airline websites directly
  4. Book early morning or late evening flights
  5. Travel Tuesday-Thursday for better rates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Ready to book? Links provided above or search on:
   • Skyscanner.com
   • Momondo.com
   • Google Flights
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    console.log(`✓ ${this.name}: Results synthesized`);
    return recommendation;
  }
}

class DemoSearchAgent extends DemoAgent {
  constructor() {
    super('SearchAgent', 'Demo Mode');
  }

  async search(searchParams) {
    console.log(`\n🔍 ${this.name}: Searching flights across platforms...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`✓ ${this.name}: Search completed`);
    return mockFlightData;
  }
}

class DemoPriceAnalyzer extends DemoAgent {
  constructor() {
    super('PriceAnalyzer', 'Demo Mode');
  }

  async analyze(flightData) {
    console.log(`\n💰 ${this.name}: Analyzing prices and value...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analysis = {
      bestPrice: {
        amount: 380,
        source: 'American Airlines',
        flightId: 'AA123'
      },
      priceRange: {
        min: 380,
        max: 450,
        average: 418
      },
      recommendations: [
        'American Airlines offers best value at $380',
        'Price is 15% below route average',
        'Consider layover time vs. cost savings'
      ],
      warnings: [
        'Cheapest option has 1 layover',
        'Check baggage fees before booking',
        'Verify cancellation policy'
      ]
    };
    
    console.log(`✓ ${this.name}: Analysis completed`);
    return analysis;
  }
}

class DemoStrategyAgent extends DemoAgent {
  constructor() {
    super('StrategyAgent', 'Demo Mode');
  }

  async strategize(searchParams, priceAnalysis) {
    console.log(`\n🎲 ${this.name}: Developing booking strategy...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const strategy = {
      bookingRecommendation: 'book_now',
      reasoning: 'Prices typically increase 2-3 weeks before departure. Current prices are favorable.',
      alternativeDates: [
        {
          departDate: '2024-03-16',
          returnDate: '2024-03-23',
          estimatedSavings: '$25'
        },
        {
          departDate: '2024-03-13',
          returnDate: '2024-03-20',
          estimatedSavings: '$35'
        }
      ],
      tips: [
        'Tuesday and Wednesday flights are typically cheaper',
        'Consider nearby airports for better deals',
        'Set up price alerts for this route',
        'Book at least 3 weeks in advance for best prices'
      ],
      priceAlerts: {
        setup: true,
        targetPrice: 350
      }
    };
    
    console.log(`✓ ${this.name}: Strategy developed`);
    return strategy;
  }
}

class DemoFlightScanner {
  constructor() {
    this.orchestrator = new DemoOrchestrator();
    this.searchAgent = new DemoSearchAgent();
    this.priceAnalyzer = new DemoPriceAnalyzer();
    this.strategyAgent = new DemoStrategyAgent();
  }

  async findFlights(userRequest) {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║     Multi-Agent Flight Scanner - DEMO MODE           ║');
    console.log('║     (Running without API keys for testing)           ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    try {
      const structuredRequest = await this.orchestrator.orchestrate(userRequest);
      const { searchParams } = structuredRequest;

      const searchResults = await this.searchAgent.search(searchParams);
      const priceAnalysis = await this.priceAnalyzer.analyze(searchResults);
      const strategy = await this.strategyAgent.strategize(searchParams, priceAnalysis);

      const finalRecommendation = await this.orchestrator.synthesize(
        searchResults,
        priceAnalysis,
        strategy
      );

      console.log('\n╔═══════════════════════════════════════════════════════╗');
      console.log('║              Final Recommendations                    ║');
      console.log('╚═══════════════════════════════════════════════════════╝\n');
      console.log(finalRecommendation);

      return {
        searchParams,
        searchResults,
        priceAnalysis,
        strategy,
        finalRecommendation
      };

    } catch (error) {
      console.error('\n❌ Error during flight search:', error.message);
      throw error;
    }
  }
}

async function main() {
  const scanner = new DemoFlightScanner();
  
  const userRequest = `
    I need a flight from New York (JFK) to London (LHR).
    Departing March 15, 2024, returning March 22, 2024.
    Looking for economy class, 1 passenger.
    Priority is best price but willing to consider convenience.
  `;

  await scanner.findFlights(userRequest);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ℹ️  This is DEMO MODE with simulated responses.');
  console.log('   To use real AI agents, add your API keys to .env file:');
  console.log('   - OPENAI_API_KEY');
  console.log('   - ANTHROPIC_API_KEY');
  console.log('   Then run: npm start');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default DemoFlightScanner;
