// Serverless function to process AI chat requests
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export default async (req, res) => {
  try {
    // Get the query from the request body
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is not configured' });
    }
    
    // Call the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for Samsung Finance+, a financing service in the Philippines. Provide concise, accurate information about Samsung Finance+ services, application process, eligibility, and troubleshooting. The chatbot also has a structured menu system with detailed answers to common questions, so if the query seems like it would be better answered by a menu option, suggest the user try specific keywords related to their question. If you don\'t know the answer, say so politely and suggest reaching out to a live agent or trying specific keywords to navigate the menu system.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: parseInt(process.env.MAX_TOKENS || '500'),
        temperature: parseFloat(process.env.TEMPERATURE || '0.7')
      })
    });
    
    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }
    
    // Return the AI response
    return res.status(200).json({ response: data.choices[0].message.content });
    
  } catch (error) {
    console.error('Error processing AI request:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}; 