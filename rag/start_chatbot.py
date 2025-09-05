#!/usr/bin/env python3
"""
Startup script for the Wine Store Chatbot (Gradio interface)
"""

import sys
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

if __name__ == "__main__":
    print("🍷 Starting Wine Store Customer Support Bot...")
    print("🤖 RAG system initializing...")
    print("📚 Loading knowledge base...")
    print("🌐 Launching Gradio interface...")
    print("-" * 50)
    
    # Import and run the chatbot
    from gradio_apps.wine_chatbot import main
    main()