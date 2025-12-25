// Test with direct axios call (bypassing SDK)
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Anthropic API with direct HTTP call...\n');

const testAnthropicAPI = async () => {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [
          { role: 'user', content: 'Say hello in one sentence!' }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    console.log('✅ SUCCESS!');
    console.log('Model:', response.data.model);
    console.log('Response:', response.data.content[0].text);
    console.log('Tokens used:', response.data.usage);
    
  } catch (error) {
    console.error('❌ FAILED');
    console.error('Error:', error.response?.data || error.message);
  }
};

testAnthropicAPI();
