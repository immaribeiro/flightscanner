// Quick test to verify Anthropic SDK
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Anthropic SDK...');
console.log('Anthropic import:', typeof Anthropic);
console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);

try {
  const client = new Anthropic({ 
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultHeaders: {
      'anthropic-version': '2023-06-01'
    }
  });
  console.log('✓ Client created successfully');
  console.log('Client type:', typeof client);
  console.log('Client has messages:', typeof client.messages);
  
  // Try a simple API call
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 20,
    messages: [{ role: 'user', content: 'Say hi' }]
  });
  
  console.log('✓ API call successful!');
  console.log('Response:', response.content[0].text);
  
} catch (error) {
  console.error('✗ Error:', error.message);
  console.error('Error type:', error.constructor.name);
}
