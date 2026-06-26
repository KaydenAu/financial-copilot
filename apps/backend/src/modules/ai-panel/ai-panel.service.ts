import Groq from 'groq-sdk';

export interface ChatCompletionMessageParam {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class GroqService {
  private groq: Groq;
  private defaultModel = 'llama-3.3-70b-versatile'; 

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  /**
   * Dispatches unified context payloads straight to Groq hardware clusters.
   */
  public async generateChatResponse(
    history: ChatCompletionMessageParam[],
    financialSummary: string,
    userPreferenceContext: string = 'RM'
  ): Promise<string> {
    
    // Inject structural system guardrails to guide your financial copilot persona
   const systemPrompt: ChatCompletionMessageParam = {
      role: 'system',
      content: `You are an expert financial copilot AI embedded in a tracking ledger workspace.
                Format all conversational responses in clean, structured Markdown.

                === LIVE LEDGER CONTEXT ===
                ${financialSummary}
                ==========================

                CRITICAL TRANSACTION MANIPULATION PROTOCOL:
                1. STAGE & CONFIRM PHASE: If the user asks to add a transaction (or uses the suggestion chip) but has NOT explicitly confirmed it yet, read the details, build a clean Markdown confirmation block showing Amount, Category, Description, and Date, and ask them to confirm if everything looks correct. DO NOT write or append any tracking tags in this phase.
                
                2. COMMIT PHASE: If the previous message listed a transaction breakdown and the user's current response is an explicit affirmation (e.g., "yes", "confirm", "correct", "go ahead", "looks good"), acknowledge the success, and you MUST append this EXACT hidden metadata block at the absolute end of your response text so the backend engine can process the write:
                   [COMMIT_TRANSACTION]{"amount": 45.00, "categoryOrSubcategory": "Food & Drink", "description": "Dinner", "date": "2026-06-26"}
                   
                Ensure the JSON attributes match the parameters verified by the user. Use the current date (${new Date().toISOString().split('T')[0]}) if no date was specified.`
    };

    const chatCompletion = await this.groq.chat.completions.create({
      messages: [systemPrompt, ...history],
      model: this.defaultModel,
      temperature: 0.1, // Low temperature forces absolute consistency with JSON syntax tokens
    });

    return chatCompletion.choices[0]?.message?.content || 'Error processing request.';
  }
}

// Export a reusable service singleton instance
export const groqService = new GroqService();