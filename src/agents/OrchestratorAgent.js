import { ClaudeAgent } from './BaseAgent.js';

export class OrchestratorAgent extends ClaudeAgent {
  constructor() {
    const systemPrompt = `You are the Orchestrator Agent for a flight price comparison system.

Your responsibilities:
1. Parse user flight search requests (origin, destination, dates, preferences)
2. Validate and structure the search parameters
3. Coordinate with specialized agents (Search, Price Analyzer, Strategy)
4. Synthesize results from all agents into clear recommendations
5. Handle errors and edge cases gracefully

Output format should be JSON with:
{
  "searchParams": {
    "origin": "city/airport code",
    "destination": "city/airport code", 
    "departDate": "YYYY-MM-DD",
    "returnDate": "YYYY-MM-DD",
    "passengers": number,
    "class": "economy|business|first"
  },
  "taskAssignments": ["search", "analyze", "strategy"],
  "priority": "price|time|convenience"
}`;

    super('Orchestrator', systemPrompt);
  }

  async orchestrate(userRequest) {
    console.log(`\n🎯 ${this.name}: Processing user request...`);
    
    const prompt = `Parse this flight search request and structure it for processing:

"${userRequest}"

Provide search parameters and determine which agents should be activated.`;

    const response = await this.execute(prompt);
    
    try {
      const structured = JSON.parse(response.content);
      console.log(`✓ ${this.name}: Request structured successfully`);
      return structured;
    } catch (error) {
      console.error(`✗ ${this.name}: Failed to parse response`);
      return { error: 'Failed to structure request', raw: response.content };
    }
  }

  async synthesize(searchResults, analysisResults, strategyResults) {
    console.log(`\n🎯 ${this.name}: Synthesizing results from all agents...`);
    
    const prompt = `Synthesize flight search results into clear recommendations:

SEARCH RESULTS:
${JSON.stringify(searchResults, null, 2)}

PRICE ANALYSIS:
${JSON.stringify(analysisResults, null, 2)}

STRATEGY RECOMMENDATIONS:
${JSON.stringify(strategyResults, null, 2)}

Provide a clear, actionable summary with:
1. Best overall option (consider price, convenience, timing)
2. Alternative options with pros/cons
3. Key insights and recommendations
4. Price trends and booking advice`;

    const response = await this.execute(prompt);
    console.log(`✓ ${this.name}: Results synthesized`);
    return response.content;
  }
}
