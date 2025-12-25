import chalk from 'chalk';

/**
 * Format flight results in a readable way
 */

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatStops(stops) {
  if (stops === 0) return chalk.green('Direct Flight ✈️');
  if (stops === 1) return chalk.yellow('1 Stop');
  return chalk.yellow(`${stops} Stops`);
}

export function displayFlightResults(searchResults, priceAnalysis, strategy) {
  console.log('\n' + '═'.repeat(80));
  console.log(chalk.bold.cyan('                    ROUND-TRIP FLIGHT SEARCH RESULTS'));
  console.log('═'.repeat(80) + '\n');

  // Display flights
  if (searchResults.flights && searchResults.flights.length > 0) {
    console.log(chalk.bold.white(`📍 Source: ${searchResults.source || 'Multiple Platforms'}`));
    
    if (searchResults.requestedDates) {
      console.log(chalk.gray(`   Requested: ${searchResults.requestedDates.outbound} → ${searchResults.requestedDates.return}`));
    }
    console.log('');

    // Sort flights by price
    const sortedFlights = [...searchResults.flights].sort((a, b) => {
      const priceA = a.totalPrice || a.price || 0;
      const priceB = b.totalPrice || b.price || 0;
      return priceA - priceB;
    });

    sortedFlights.forEach((flight, index) => {
      const isTopChoice = index === 0;
      const borderColor = isTopChoice ? chalk.green : chalk.gray;
      const totalPrice = flight.totalPrice || flight.price;
      
      console.log(borderColor('┌' + '─'.repeat(78) + '┐'));
      
      if (isTopChoice) {
        console.log(borderColor('│') + chalk.green.bold('  ⭐ BEST PRICE - ROUND TRIP') + ' '.repeat(51) + borderColor('│'));
      }
      
      // Show flexibility info
      if (flight.flexibility && flight.flexibility !== 'EXACT_DATES') {
        const flexText = `  📅 ${flight.flexibility}`;
        const flexPadding = Math.max(0, 78 - flexText.length);
        console.log(borderColor('│') + 
          chalk.yellow(flexText) +
          (flight.savings ? chalk.green(` (Save ${flight.savings})`) : '') +
          ' '.repeat(Math.max(0, flexPadding - (flight.savings ? ` (Save ${flight.savings})`.length : 0))) +
          borderColor('│')
        );
      }
      
      // Total Price
      const priceText = `  💰 TOTAL: ${flight.currency || 'EUR'} €${totalPrice}`;
      const pricePadding = Math.max(0, 78 - priceText.length);
      console.log(borderColor('│') + 
        chalk.bold.yellow(priceText) +
        ' '.repeat(pricePadding) +
        borderColor('│')
      );
      
      console.log(borderColor('│') + chalk.white('  ') + borderColor('│'));
      
      // OUTBOUND FLIGHT
      if (flight.outbound) {
        const out = flight.outbound;
        console.log(borderColor('│') + chalk.bold.cyan('  ✈️  OUTBOUND FLIGHT') + ' '.repeat(58) + borderColor('│'));
        
        const outAirlineText = `    ${out.airline}${out.flightNumber ? ` - ${out.flightNumber}` : ''}`;
        const outAirlinePadding = Math.max(0, 78 - outAirlineText.length);
        console.log(borderColor('│') + 
          chalk.white(outAirlineText) +
          ' '.repeat(outAirlinePadding) +
          borderColor('│')
        );
        
        const outDateText = `    📅 ${out.date || formatDateTime(out.departure).split(',')[0]}`;
        const outDatePadding = Math.max(0, 78 - outDateText.length);
        console.log(borderColor('│') + 
          chalk.gray(outDateText) +
          ' '.repeat(outDatePadding) +
          borderColor('│')
        );
        
        const outDepartText = `    🛫 ${out.departureAirport || 'DEP'} → ${out.arrivalAirport || 'ARR'}: ${formatDateTime(out.departure)}`;
        const outDepartPadding = Math.max(0, 78 - outDepartText.length);
        console.log(borderColor('│') + 
          chalk.white(outDepartText) +
          ' '.repeat(outDepartPadding) +
          borderColor('│')
        );
        
        const outArrivalText = `    🛬 Arrival: ${formatDateTime(out.arrival)}`;
        const outArrivalPadding = Math.max(0, 78 - outArrivalText.length);
        console.log(borderColor('│') + 
          chalk.white(outArrivalText) +
          ' '.repeat(outArrivalPadding) +
          borderColor('│')
        );
        
        const outDurationText = `    ⏱️  ${formatDuration(out.duration)}`;
        const outDurationPadding = Math.max(0, 78 - outDurationText.length);
        console.log(borderColor('│') + 
          chalk.white(outDurationText) +
          ' '.repeat(outDurationPadding) +
          borderColor('│')
        );
        
        const outStopsDisplay = formatStops(out.stops);
        const outStopsPlain = outStopsDisplay.replace(/\x1B\[[0-9;]*m/g, '');
        const outStopsText = `    🔄 ${outStopsPlain}`;
        const outStopsPadding = Math.max(0, 78 - outStopsText.length);
        console.log(borderColor('│') + 
          chalk.white(`    🔄 `) + outStopsDisplay +
          ' '.repeat(outStopsPadding) +
          borderColor('│')
        );
        
        if (out.layovers && out.layovers.length > 0) {
          const layoverText = `       via ${out.layovers.join(', ')}`;
          const layoverPadding = Math.max(0, 78 - layoverText.length);
          console.log(borderColor('│') + 
            chalk.gray(layoverText) +
            ' '.repeat(layoverPadding) +
            borderColor('│')
          );
        }
      }
      
      console.log(borderColor('│') + chalk.white('  ') + borderColor('│'));
      
      // RETURN FLIGHT
      if (flight.return) {
        const ret = flight.return;
        console.log(borderColor('│') + chalk.bold.magenta('  ✈️  RETURN FLIGHT') + ' '.repeat(60) + borderColor('│'));
        
        const retAirlineText = `    ${ret.airline}${ret.flightNumber ? ` - ${ret.flightNumber}` : ''}`;
        const retAirlinePadding = Math.max(0, 78 - retAirlineText.length);
        console.log(borderColor('│') + 
          chalk.white(retAirlineText) +
          ' '.repeat(retAirlinePadding) +
          borderColor('│')
        );
        
        const retDateText = `    📅 ${ret.date || formatDateTime(ret.departure).split(',')[0]}`;
        const retDatePadding = Math.max(0, 78 - retDateText.length);
        console.log(borderColor('│') + 
          chalk.gray(retDateText) +
          ' '.repeat(retDatePadding) +
          borderColor('│')
        );
        
        const retDepartText = `    🛫 ${ret.departureAirport || 'DEP'} → ${ret.arrivalAirport || 'ARR'}: ${formatDateTime(ret.departure)}`;
        const retDepartPadding = Math.max(0, 78 - retDepartText.length);
        console.log(borderColor('│') + 
          chalk.white(retDepartText) +
          ' '.repeat(retDepartPadding) +
          borderColor('│')
        );
        
        const retArrivalText = `    🛬 Arrival: ${formatDateTime(ret.arrival)}`;
        const retArrivalPadding = Math.max(0, 78 - retArrivalText.length);
        console.log(borderColor('│') + 
          chalk.white(retArrivalText) +
          ' '.repeat(retArrivalPadding) +
          borderColor('│')
        );
        
        const retDurationText = `    ⏱️  ${formatDuration(ret.duration)}`;
        const retDurationPadding = Math.max(0, 78 - retDurationText.length);
        console.log(borderColor('│') + 
          chalk.white(retDurationText) +
          ' '.repeat(retDurationPadding) +
          borderColor('│')
        );
        
        const retStopsDisplay = formatStops(ret.stops);
        const retStopsPlain = retStopsDisplay.replace(/\x1B\[[0-9;]*m/g, '');
        const retStopsText = `    🔄 ${retStopsPlain}`;
        const retStopsPadding = Math.max(0, 78 - retStopsText.length);
        console.log(borderColor('│') + 
          chalk.white(`    🔄 `) + retStopsDisplay +
          ' '.repeat(retStopsPadding) +
          borderColor('│')
        );
        
        if (ret.layovers && ret.layovers.length > 0) {
          const layoverText = `       via ${ret.layovers.join(', ')}`;
          const layoverPadding = Math.max(0, 78 - layoverText.length);
          console.log(borderColor('│') + 
            chalk.gray(layoverText) +
            ' '.repeat(layoverPadding) +
            borderColor('│')
          );
        }
      }
      
      // Link
      if (flight.link) {
        console.log(borderColor('│') + chalk.white('  ') + borderColor('│'));
        const linkText = `  🔗 Book: ${flight.provider || 'Online'}`;
        const linkPadding = Math.max(0, 78 - linkText.length);
        console.log(borderColor('│') + 
          chalk.blue(linkText) +
          ' '.repeat(linkPadding) +
          borderColor('│')
        );
        
        if (flight.link.length < 70) {
          const urlPadding = Math.max(0, 78 - flight.link.length - 5);
          console.log(borderColor('│') + 
            chalk.blue.underline(`     ${flight.link}`) +
            ' '.repeat(urlPadding) +
            borderColor('│')
          );
        } else {
          console.log(borderColor('│') + 
            chalk.blue.underline(`     ${flight.link.substring(0, 70)}...`) +
            borderColor('│')
          );
        }
      }
      
      console.log(borderColor('└' + '─'.repeat(78) + '┘\n'));
    });
  }

  // Display price analysis
  if (priceAnalysis && priceAnalysis.priceRange) {
    console.log('\n' + chalk.bold.cyan('💰 PRICE ANALYSIS'));
    console.log('─'.repeat(80));
    console.log(chalk.white(`  Lowest Price:  ${chalk.green.bold('$' + priceAnalysis.priceRange.min)}`));
    console.log(chalk.white(`  Highest Price: ${chalk.red.bold('$' + priceAnalysis.priceRange.max)}`));
    console.log(chalk.white(`  Average Price: ${chalk.yellow.bold('$' + priceAnalysis.priceRange.average)}`));
    
    if (priceAnalysis.bestPrice) {
      console.log(chalk.white(`\n  ⭐ Best Deal: $${priceAnalysis.bestPrice.amount} on ${priceAnalysis.bestPrice.source}`));
    }
    
    if (priceAnalysis.recommendations && priceAnalysis.recommendations.length > 0) {
      console.log(chalk.white('\n  📊 Insights:'));
      priceAnalysis.recommendations.forEach(rec => {
        console.log(chalk.white(`    • ${rec}`));
      });
    }
    
    if (priceAnalysis.warnings && priceAnalysis.warnings.length > 0) {
      console.log(chalk.yellow('\n  ⚠️  Warnings:'));
      priceAnalysis.warnings.forEach(warning => {
        console.log(chalk.yellow(`    • ${warning}`));
      });
    }
    console.log('');
  }

  // Display strategy
  if (strategy) {
    console.log('\n' + chalk.bold.cyan('🎲 BOOKING STRATEGY'));
    console.log('─'.repeat(80));
    
    if (strategy.bookingRecommendation) {
      const recText = strategy.bookingRecommendation.toUpperCase();
      const recColor = recText.includes('BOOK NOW') ? chalk.green : 
                      recText.includes('WAIT') ? chalk.yellow : 
                      chalk.blue;
      console.log(recColor(`  Recommendation: ${recText}`));
    }
    
    if (strategy.reasoning) {
      console.log(chalk.white(`  Reasoning: ${strategy.reasoning}`));
    }
    
    if (strategy.alternativeDates && strategy.alternativeDates.length > 0) {
      console.log(chalk.white('\n  📅 Alternative Dates:'));
      strategy.alternativeDates.forEach(alt => {
        console.log(chalk.white(`    • ${alt.departDate} to ${alt.returnDate} - Save ${alt.estimatedSavings}`));
      });
    }
    
    if (strategy.tips && strategy.tips.length > 0) {
      console.log(chalk.white('\n  💡 Tips:'));
      strategy.tips.forEach(tip => {
        console.log(chalk.white(`    • ${tip}`));
      });
    }
    
    if (strategy.priceAlerts && strategy.priceAlerts.setup) {
      console.log(chalk.blue(`\n  🔔 Set up price alerts for: $${strategy.priceAlerts.targetPrice}`));
    }
    console.log('');
  }

  console.log('═'.repeat(80) + '\n');
}

export function displaySummary(finalRecommendation) {
  console.log('\n' + '═'.repeat(80));
  console.log(chalk.bold.cyan('                          SUMMARY & RECOMMENDATIONS'));
  console.log('═'.repeat(80) + '\n');
  
  console.log(chalk.white(finalRecommendation));
  
  console.log('\n' + '═'.repeat(80) + '\n');
}
