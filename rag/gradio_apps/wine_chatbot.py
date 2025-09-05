#!/usr/bin/env python3
"""
Wine Store Customer Support Chatbot
Gradio interface that integrates with the RAG system
"""

import gradio as gr
import sys
import json
from pathlib import Path
from typing import List, Dict, Any
import logging

# Add parent directory to path
parent_dir = Path(__file__).parent.parent
sys.path.append(str(parent_dir))
sys.path.append(str(parent_dir / "llm_scripts"))

from llm_scripts.rag_system import WineRAGSystem

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WineChatbot:
    def __init__(self):
        """Initialize the wine chatbot with RAG system"""
        self.rag = WineRAGSystem()
        self.conversation_history = []
        logger.info("Wine Chatbot initialized with RAG system")
    
    def chat(self, message: str, history: List[List[str]]) -> tuple:
        """
        Main chat function that processes user messages
        
        Args:
            message: User's message
            history: Conversation history
            
        Returns:
            Tuple of (updated_history, empty_message)
        """
        if not message.strip():
            return history, ""
        
        try:
            # Add user message to history
            history.append([message, ""])
            
            # Use RAG system to generate response
            result = self.rag.query(message, limit=3)
            
            # Extract response
            response = result['response']
            
            # Add bot response to history
            history[-1][1] = response
            
            # Log the interaction
            logger.info(f"User: {message[:50]}...")
            logger.info(f"Bot: {response[:50]}...")
            
            return history, ""
            
        except Exception as e:
            error_msg = f"I apologize, but I encountered an error: {str(e)}"
            history[-1][1] = error_msg
            logger.error(f"Chat error: {e}")
            return history, ""
    
    def get_system_status(self) -> str:
        """Get system status information"""
        try:
            # Check if we have any data in the knowledge base
            test_results = self.rag.search("wine", limit=1)
            doc_count = len(test_results)
            
            status = f"""
🤖 **Wine Store Customer Support Bot**

📊 **System Status:**
- ✅ RAG System: Active
- ✅ Vector Database: Connected
- ✅ LLM Model: {self.rag.model_name}
- 📚 Knowledge Base: {doc_count} documents available

🎯 **I can help you with:**
- Wine recommendations and pairings
- Order tracking and status
- Shipping and delivery questions
- Returns and refunds
- Product information
- General customer support

💬 **How to use:**
Just type your question and I'll search through our knowledge base to provide you with the most relevant information!
            """
            return status
            
        except Exception as e:
            return f"❌ System Status Error: {str(e)}"
    
    def process_new_emails(self, max_emails: int = 10) -> str:
        """Process new emails and update knowledge base"""
        try:
            logger.info(f"Processing {max_emails} new emails...")
            
            # Process emails
            emails = self.rag.process_emails(max_emails=max_emails)
            
            if not emails:
                return "❌ No new emails found to process"
            
            # Convert to documents and chunk
            from langchain.schema import Document
            documents = []
            for email in emails:
                doc = Document(
                    page_content=email['content'],
                    metadata=email['metadata']
                )
                documents.append(doc)
            
            # Chunk and store
            chunked_docs = self.rag.chunk_documents(emails)
            self.rag.create_embeddings_and_store(chunked_docs)
            
            return f"✅ Successfully processed {len(emails)} emails and added {len(chunked_docs)} chunks to knowledge base"
            
        except Exception as e:
            error_msg = f"❌ Error processing emails: {str(e)}"
            logger.error(error_msg)
            return error_msg
    
    def search_knowledge_base(self, query: str, limit: int = 5) -> str:
        """Search the knowledge base and return results"""
        try:
            results = self.rag.search(query, limit=limit)
            
            if not results:
                return f"🔍 No results found for: '{query}'"
            
            response = f"🔍 **Search Results for: '{query}'**\n\n"
            
            for i, result in enumerate(results, 1):
                doc_type = result['metadata'].get('type', 'unknown')
                score = result['score']
                content = result['content'][:200] + "..." if len(result['content']) > 200 else result['content']
                
                response += f"**{i}. {doc_type.upper()}** (Score: {score:.3f})\n"
                response += f"{content}\n\n"
            
            return response
            
        except Exception as e:
            return f"❌ Search error: {str(e)}"

# Initialize chatbot
chatbot = WineChatbot()

# Create Gradio interface
def create_interface():
    """Create the Gradio interface"""
    
    with gr.Blocks(
        title="🍷 Wine Store Customer Support",
        theme=gr.themes.Soft(),
        css="""
        .gradio-container {
            max-width: 1200px !important;
        }
        .chat-message {
            padding: 10px;
            margin: 5px 0;
            border-radius: 10px;
        }
        """
    ) as demo:
        
        gr.Markdown("# 🍷 Wine Store Customer Support Bot")
        gr.Markdown("Ask me anything about wines, orders, shipping, or general questions!")
        
        with gr.Row():
            # Left column - Chat interface
            with gr.Column(scale=3):
                gr.Markdown("## 💬 Chat with our AI Assistant")
                
                # Chat interface
                chatbot_interface = gr.Chatbot(
                    label="Customer Support Chat",
                    height=500,
                    show_label=True,
                    container=True,
                    bubble_full_width=False
                )
                
                # Message input
                msg_input = gr.Textbox(
                    label="Your Message",
                    placeholder="Ask about wines, orders, shipping, returns, or anything else...",
                    lines=2,
                    max_lines=4
                )
                
                # Send button
                send_btn = gr.Button("Send", variant="primary", size="lg")
                
                # Chat functionality
                msg_input.submit(
                    fn=chatbot.chat,
                    inputs=[msg_input, chatbot_interface],
                    outputs=[chatbot_interface, msg_input]
                )
                
                send_btn.click(
                    fn=chatbot.chat,
                    inputs=[msg_input, chatbot_interface],
                    outputs=[chatbot_interface, msg_input]
                )
            
            # Right column - System controls and info
            with gr.Column(scale=1):
                gr.Markdown("## 🛠️ System Controls")
                
                # System status
                status_btn = gr.Button("📊 Check System Status", variant="secondary")
                status_output = gr.Markdown("Click 'Check System Status' to see system information")
                
                status_btn.click(
                    fn=chatbot.get_system_status,
                    outputs=status_output
                )
                
                gr.Markdown("---")
                
                # Email processing
                gr.Markdown("### 📧 Email Processing")
                email_count = gr.Slider(
                    minimum=1,
                    maximum=50,
                    value=10,
                    step=1,
                    label="Number of emails to process"
                )
                process_btn = gr.Button("🔄 Process New Emails", variant="secondary")
                process_output = gr.Textbox(
                    label="Processing Status",
                    lines=3,
                    interactive=False
                )
                
                process_btn.click(
                    fn=chatbot.process_new_emails,
                    inputs=email_count,
                    outputs=process_output
                )
                
                gr.Markdown("---")
                
                # Knowledge base search
                gr.Markdown("### 🔍 Knowledge Base Search")
                search_query = gr.Textbox(
                    label="Search Query",
                    placeholder="Search the knowledge base...",
                    lines=1
                )
                search_btn = gr.Button("🔍 Search", variant="secondary")
                search_output = gr.Markdown("Search results will appear here")
                
                search_btn.click(
                    fn=chatbot.search_knowledge_base,
                    inputs=search_query,
                    outputs=search_output
                )
        
        # Footer with help information
        with gr.Row():
            gr.Markdown("""
            ### 🎯 **What I can help you with:**
            - **🍷 Wine Recommendations**: Find the perfect wine for any occasion
            - **📦 Order Tracking**: Check the status of your orders
            - **🚚 Shipping Info**: Get delivery times and shipping options
            - **↩️ Returns & Refunds**: Learn about our return policy
            - **📋 Product Details**: Get information about specific wines
            - **❓ General Support**: Any other questions about our wine store
            
            ### 💡 **Tips for better results:**
            - Be specific in your questions
            - Mention wine types, occasions, or specific needs
            - Ask about order numbers if you need tracking help
            """)
    
    return demo

def main():
    """Main function to launch the chatbot"""
    print("🍷 Starting Wine Store Customer Support Bot...")
    print("🤖 RAG system initialized")
    print("📚 Knowledge base ready")
    print("🌐 Launching web interface...")
    print("-" * 50)
    
    # Create and launch interface
    demo = create_interface()
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        debug=True,
        show_error=True
    )

if __name__ == "__main__":
    main()
