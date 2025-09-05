// Example Next.js integration for Wine Store RAG Chatbot
// This file shows how to integrate the RAG API with your Next.js wine store

// API configuration
const RAG_API_BASE = "http://localhost:8000/api";

// Chat API service
export class WineChatbotAPI {
  constructor(baseURL = RAG_API_BASE) {
    this.baseURL = baseURL;
  }

  // Send a message to the chatbot
  async sendMessage(message, limit = 3) {
    try {
      const response = await fetch(`${this.baseURL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      throw error;
    }
  }

  // Search the knowledge base
  async searchKnowledge(query, limit = 5) {
    try {
      const response = await fetch(`${this.baseURL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      throw error;
    }
  }

  // Get conversation suggestions
  async getSuggestions() {
    try {
      const response = await fetch(`${this.baseURL}/suggestions`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting suggestions:", error);
      throw error;
    }
  }

  // Check system status
  async getStatus() {
    try {
      const response = await fetch(`${this.baseURL}/status`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting status:", error);
      throw error;
    }
  }
}

// React component example
import React, { useState, useEffect } from "react";

const WineChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [api] = useState(new WineChatbotAPI());

  useEffect(() => {
    // Load suggestions on component mount
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const data = await api.getSuggestions();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  };

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    setIsLoading(true);

    // Add user message to chat
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      // Send to RAG API
      const response = await api.sendMessage(message);

      // Add bot response to chat
      const botMessage = { role: "bot", content: response.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Add error message to chat
      const errorMessage = {
        role: "bot",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="wine-chatbot">
      <div className="chat-header">
        <h2>🍷 Wine Store Assistant</h2>
        <p>Ask me about wines, orders, shipping, or anything else!</p>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">{message.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && messages.length === 0 && (
        <div className="suggestions">
          <h3>💡 Try asking:</h3>
          <div className="suggestion-buttons">
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-button"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about wines, orders, shipping..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default WineChatbot;

// CSS styles (add to your CSS file)
const styles = `
.wine-chatbot {
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background: white;
}

.chat-header {
  background: #8B0000;
  color: white;
  padding: 20px;
  text-align: center;
}

.chat-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.chat-header p {
  margin: 0;
  opacity: 0.9;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #8B0000;
  color: white;
}

.message.bot .message-content {
  background: white;
  border: 1px solid #ddd;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8B0000;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.suggestions {
  padding: 20px;
  background: #f0f0f0;
  border-top: 1px solid #ddd;
}

.suggestions h3 {
  margin: 0 0 15px 0;
  color: #8B0000;
}

.suggestion-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.suggestion-button {
  padding: 10px 15px;
  border: 1px solid #8B0000;
  background: white;
  color: #8B0000;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 14px;
}

.suggestion-button:hover {
  background: #8B0000;
  color: white;
}

.chat-input {
  display: flex;
  padding: 20px;
  background: white;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
  font-size: 16px;
}

.chat-input input:focus {
  border-color: #8B0000;
}

.chat-input button {
  margin-left: 10px;
  padding: 12px 24px;
  background: #8B0000;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.chat-input button:hover:not(:disabled) {
  background: #A00000;
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
`;

// Usage in your Next.js app
// 1. Add the WineChatbot component to your page
// 2. Make sure the RAG API server is running on port 8000
// 3. Customize the styling to match your wine store theme
