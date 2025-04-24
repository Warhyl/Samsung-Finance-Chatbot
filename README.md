# Samsung Finance+ Chatbot with AI Integration

## Overview
This is an enhanced version of the Samsung Finance+ Chatbot that includes AI capabilities using OpenAI's API. The chatbot now can:
1. Respond to structured menu selections
2. Use AI to answer open-ended questions
3. Seamlessly switch between menu-driven responses and AI responses

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- An OpenAI API key

### Installation
1. Clone this repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Configuration
You can customize the AI behavior by modifying these environment variables in the `.env` file:
- `AI_MODEL`: The OpenAI model to use (default: gpt-3.5-turbo)
- `MAX_TOKENS`: Maximum tokens for AI responses (default: 500)
- `TEMPERATURE`: Controls randomness - lower is more deterministic (default: 0.7)

## Using the AI Chatbot
- Access the chatbot through `chatbot.html`
- Navigate the menu system as normal
- To use AI, type a message starting with "AI:" followed by your question
  Example: "AI: What are the benefits of Samsung Finance+?"
- You can also use AI by selecting "Yes, use AI" when the chatbot doesn't have a specific answer

## Deployment
To deploy to a hosting service:
1. Make sure all environment variables are properly set
2. Deploy the API endpoint that handles the AI requests
3. Update the fetch URL in `script.js` if needed

## Security Notes
- The OpenAI API key is kept secure by using a serverless function
- All AI requests are processed on the server side
- No API keys are exposed in the client-side code

## Troubleshooting
If you encounter any issues:
1. Check your OpenAI API key is valid
2. Make sure your environment variables are properly configured
3. Check server logs for any API errors

---

For more information about Samsung Finance+, visit [Samsung Philippines website](https://www.samsung.com/ph/). 