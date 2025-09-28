/**
 * CHATBOT API SERVICE - Back to the working Python RAG system
 * This uses the Python FastAPI server with proper semantic search
 */

const RAG_API_BASE_URL = process.env.RAG_API_URL || "http://localhost:8000/api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface RAGSearchResult {
  id: string;
  content: string;
  metadata: {
    type: string;
    //[key: string]: any;
    [key: string]: string;
  };
  score: number;
}

export interface RAGResponse {
  response: string;
  sources: RAGSearchResult[];
  suggestions: string[];
}

class ChatbotAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = RAG_API_BASE_URL;
    console.log("🤖 ChatbotAPI initialized with Python RAG system");
  }

  /**
   * Send a message to the RAG system and get a response
   */
  async sendMessage(message: string): Promise<RAGResponse> {
    try {
      console.log("💬 Processing message:", message);

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          user_id: "wine_store_user",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error processing message:", error);
      return {
        response:
          "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        sources: [],
        suggestions: [
          "What wines do you recommend?",
          "What's your return policy?",
          "Do you have any Italian wines?",
        ],
      };
    }
  }

  /**
   * Search the knowledge base for relevant information
   */
  async searchKnowledge(
    query: string,
    limit: number = 5
  ): Promise<RAGSearchResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          limit: limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      return [];
    }
  }

  /**
   * Get suggested questions
   */
  async getSuggestions(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/suggestions`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error("Error getting suggestions:", error);
      return [
        "What wines do you recommend?",
        "What's your return policy?",
        "Do you have any Italian wines?",
      ];
    }
  }

  /**
   * Check if the RAG API server is running
   */
  async getStatus(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking RAG API status:", error);
      return {
        status: "error",
        message: "RAG API server is not responding",
      };
    }
  }
}

// Export singleton instance
export const chatbotAPI = new ChatbotAPI();
