#!/usr/bin/env python3
"""
Startup script for the Wine Store RAG API Server
"""

import sys
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

if __name__ == "__main__":
    print("🍷 Starting Wine Store RAG API Server...")
    print("🤖 RAG system initializing...")
    print("📚 Loading knowledge base...")
    print("🌐 API server starting...")
    print("-" * 50)
    print("📡 API will be available at: http://localhost:8000")
    print("📚 API docs will be available at: http://localhost:8000/docs")
    print("🔗 Ready for Next.js integration!")
    print("-" * 50)
    
    # Import and run the API server
    from api_server import main
    main()
