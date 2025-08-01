import { ICharacter } from '../models/character';
import { IMessage } from '../models/message';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export class GeminiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not found in environment variables');
    }
  }

  private buildCharacterPrompt(character: ICharacter): string {
    return `You are ${character.name}, a character with the following personality and traits:

${character.personality}

${character.description}

IMPORTANT RULES:
1. Always stay in character as ${character.name}
2. Respond naturally and conversationally
3. Use the personality traits and background provided
4. Keep responses engaging but not overly long
5. Never break character or mention that you're an AI
6. Respond as if you're having a real conversation with the user

Now, respond to the user's message as ${character.name}:`;
  }

  private formatConversationHistory(messages: IMessage[]): ChatMessage[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  private async makeGeminiRequest(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from Gemini API');
      }

      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  async generateCharacterResponse(
    character: ICharacter,
    userMessage: string,
    conversationHistory: IMessage[]
  ): Promise<string> {
    const characterPrompt = this.buildCharacterPrompt(character);
    const formattedHistory = this.formatConversationHistory(conversationHistory);
    
    // Build the full conversation context
    let fullPrompt = characterPrompt + '\n\n';
    
    // Add conversation history
    if (formattedHistory.length > 0) {
      fullPrompt += 'Previous conversation:\n';
      formattedHistory.forEach(msg => {
        const role = msg.role === 'user' ? 'User' : character.name;
        fullPrompt += `${role}: ${msg.content}\n`;
      });
      fullPrompt += '\n';
    }
    
    // Add the current user message
    fullPrompt += `User: ${userMessage}\n\n${character.name}:`;

    return await this.makeGeminiRequest(fullPrompt);
  }

  async generateSuggestions(character: ICharacter): Promise<string[]> {
    const prompt = `You are ${character.name}. Based on your personality and background, suggest 3 engaging conversation starters that you might say to someone. Keep them natural and in character. Return only the suggestions, one per line, without numbering or additional text.`;

    try {
      const response = await this.makeGeminiRequest(prompt);
      return response.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return [
        "Hi there! How are you doing today?",
        "What brings you here?",
        "I'd love to hear about your day!"
      ];
    }
  }
}

export const geminiService = new GeminiService(); 