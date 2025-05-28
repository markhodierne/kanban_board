const OpenAI = require('openai');

class AiService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable is not set');
      this.isConfigured = false;
      return;
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.isConfigured = true;
  }

  async generateTaskAdvice(title, description) {
    if (!this.isConfigured) {
      throw new Error('AI service is not properly configured. Please check OPENAI_API_KEY environment variable.');
    }

    const prompt = this.createComprehensivePrompt(title, description);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });
      
      return response.choices[0].message.content.trim();
    } catch (error) {
      this.handleApiError(error);
    }
  }

  createComprehensivePrompt(title, description) {
    const basePrompt = `Analyze this task and provide comprehensive guidance:

Title: ${title}
Description: ${description || 'No description provided'}

Please provide practical advice covering:

1. RISK MANAGEMENT: Identify potential blockers, dependencies, or challenges that could derail this task. What should be watched carefully?

2. BEST PRACTICES: What proven approaches, standards, or methodologies should be applied? Any performance, security, or maintainability considerations?

3. IMPLEMENTATION STRATEGY: Suggest efficient approaches, tools, or techniques. Break down complex work into manageable steps.

Keep advice actionable and concise. Focus on practical guidance that helps ensure successful task completion.

IMPORTANT: Limit your response to a maximum of 100 words.`;

    return basePrompt;
  }

  handleApiError(error) {
    console.error('OpenAI API Error:', error.message);
    
    if (error.status === 429) {
      throw new Error('AI service temporarily unavailable due to rate limits. Please try again in a few moments.');
    } else if (error.status === 401) {
      throw new Error('AI service authentication failed. Please check API key configuration.');
    } else if (error.status >= 500) {
      throw new Error('AI service is experiencing technical difficulties. Please try again later.');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new Error('Unable to connect to AI service. Please check your internet connection.');
    } else if (error.name === 'AbortError' || error.message.includes('timeout')) {
      throw new Error('AI service request timed out. Please try again.');
    } else {
      throw new Error('AI service encountered an unexpected error. Please try again.');
    }
  }
}

module.exports = { AiService };