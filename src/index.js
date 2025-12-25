import { OrchestratorAgent } from './agents/OrchestratorAgent.js';
import { SearchAgent } from './agents/SearchAgent.js';
import { PriceAnalyzerAgent } from './agents/PriceAnalyzerAgent.js';
import { StrategyAgent } from './agents/StrategyAgent.js';

export class FlightScanner {
  constructor() {
    this.orchestrator = new OrchestratorAgent();
    this.searchAgent = new SearchAgent();
    this.priceAnalyzer = new PriceAnalyzerAgent();
    this.strategyAgent = new StrategyAgent();
  }

  async findFlights(userRequest) {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║     Multi-Agent Flight Scanner - Starting Search     ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    try {
      // Step 1: Orchestrator processes the request
      const structuredRequest = await this.orchestrator.orchestrate(userRequest);
      
      if (structuredRequest.error) {
        console.error('Failed to process request:', structuredRequest.error);
        return structuredRequest;
      }

      const { searchParams } = structuredRequest;

      // Step 2: Search Agent finds flights
      const searchResults = await this.searchAgent.search(searchParams);

      // Step 3: Price Analyzer evaluates the options
      const priceAnalysis = await this.priceAnalyzer.analyze(searchResults);

      // Step 4: Strategy Agent provides recommendations
      const strategy = await this.strategyAgent.strategize(searchParams, priceAnalysis);

      // Step 5: Orchestrator synthesizes everything
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

// Example usage
async function main() {
  const scanner = new FlightScanner();
  
  const userRequest = `
    I need a flight from New York (JFK) to London (LHR).
    Departing March 15, 2024, returning March 22, 2024.
    Looking for economy class, 1 passenger.
    Priority is best price but willing to consider convenience.
  `;

  await scanner.findFlights(userRequest);
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default FlightScanner;
