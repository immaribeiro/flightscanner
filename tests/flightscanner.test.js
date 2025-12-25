import { describe, it } from 'node:test';
import assert from 'node:assert';
import FlightScanner from '../src/index.js';

describe('FlightScanner', () => {
  it('should create a FlightScanner instance', () => {
    const scanner = new FlightScanner();
    assert.ok(scanner);
    assert.ok(scanner.orchestrator);
    assert.ok(scanner.searchAgent);
    assert.ok(scanner.priceAnalyzer);
    assert.ok(scanner.strategyAgent);
  });

  it('should have required agent methods', () => {
    const scanner = new FlightScanner();
    assert.strictEqual(typeof scanner.findFlights, 'function');
    assert.strictEqual(typeof scanner.orchestrator.orchestrate, 'function');
    assert.strictEqual(typeof scanner.searchAgent.search, 'function');
    assert.strictEqual(typeof scanner.priceAnalyzer.analyze, 'function');
    assert.strictEqual(typeof scanner.strategyAgent.strategize, 'function');
  });
});
