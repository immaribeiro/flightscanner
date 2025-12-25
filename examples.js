import FlightScanner from './index.js';

// Example 1: Simple search
async function example1() {
  console.log('═══════════════════════════════════════');
  console.log('Example 1: Simple NYC to London search');
  console.log('═══════════════════════════════════════\n');

  const scanner = new FlightScanner();
  const request = `
    I need a flight from New York to London.
    Leaving March 15, 2024, coming back March 22, 2024.
    One passenger, economy class.
  `;

  await scanner.findFlights(request);
}

// Example 2: Business trip with flexibility
async function example2() {
  console.log('\n═══════════════════════════════════════');
  console.log('Example 2: Flexible business trip');
  console.log('═══════════════════════════════════════\n');

  const scanner = new FlightScanner();
  const request = `
    Business trip from San Francisco to Tokyo.
    Prefer to leave around March 10, 2024, flexible on return date.
    Business class, 1 passenger.
    Priority is convenience and direct flights if possible.
  `;

  await scanner.findFlights(request);
}

// Example 3: Budget travel
async function example3() {
  console.log('\n═══════════════════════════════════════');
  console.log('Example 3: Budget-conscious travel');
  console.log('═══════════════════════════════════════\n');

  const scanner = new FlightScanner();
  const request = `
    Looking for the cheapest flights from Los Angeles to Paris.
    Dates are flexible, sometime in April 2024.
    2 passengers, economy.
    Don't mind layovers if it saves money.
  `;

  await scanner.findFlights(request);
}

// Example 4: Last-minute booking
async function example4() {
  console.log('\n═══════════════════════════════════════');
  console.log('Example 4: Last-minute emergency travel');
  console.log('═══════════════════════════════════════\n');

  const scanner = new FlightScanner();
  const request = `
    Need to fly from Chicago to Miami ASAP.
    Tomorrow if possible, one-way.
    1 passenger, any class that's available.
    Need fastest option.
  `;

  await scanner.findFlights(request);
}

// Run examples
async function runExamples() {
  console.log('\n🛫 FlightScanner Examples\n');
  console.log('These examples demonstrate different use cases.\n');
  console.log('Note: Make sure you have API keys configured in .env\n');

  const examples = [example1, example2, example3, example4];
  
  // Uncomment to run specific example:
  await examples[0]();  // Change index to run different examples
  
  // Or run all (warning: uses more API credits):
  // for (const example of examples) {
  //   await example();
  //   await new Promise(resolve => setTimeout(resolve, 2000)); // Pause between examples
  // }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}

export { example1, example2, example3, example4 };
