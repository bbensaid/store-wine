#!/usr/bin/env python3
"""
FastAPI server for Wine Store RAG Chatbot
Provides API endpoints for Next.js integration
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
from pathlib import Path
import logging

# Add current directory to path
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))
sys.path.append(str(current_dir / "llm_scripts"))

from llm_scripts.rag_system import WineRAGSystem

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Wine Store RAG API",
    description="API for Wine Store Customer Support Chatbot with RAG",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system
rag_system = WineRAGSystem()

# Pydantic models for request/response
class ChatRequest(BaseModel):
    message: str
    limit: int = 3

class ChatResponse(BaseModel):
    response: str
    relevant_documents: list
    query: str

class EmailProcessRequest(BaseModel):
    max_emails: int = 10

class SearchRequest(BaseModel):
    query: str
    limit: int = 5

class SearchResponse(BaseModel):
    results: list
    query: str
    count: int

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Wine Store RAG API is running",
        "status": "healthy",
        "model": rag_system.llm_model_name,
        "embedding_model": rag_system.embedding_model_name,
    }

# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint for customer support
    """
    try:
        logger.info(f"Chat request: {request.message[:50]}...")
        
        # Use RAG system to generate response
        result = rag_system.query(request.message, limit=request.limit)
        
        return ChatResponse(
            response=result['response'],
            relevant_documents=result['relevant_documents'],
            query=result['query']
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# Search endpoint
@app.post("/api/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """
    Search the knowledge base for relevant documents
    """
    try:
        logger.info(f"Search request: {request.query}")
        
        results = rag_system.search(request.query, limit=request.limit)
        
        return SearchResponse(
            results=results,
            query=request.query,
            count=len(results)
        )
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

# Email processing endpoint
@app.post("/api/emails/process")
async def process_emails(request: EmailProcessRequest, background_tasks: BackgroundTasks):
    """
    Process new emails and update the knowledge base
    """
    try:
        logger.info(f"Processing {request.max_emails} emails...")
        
        # Process emails
        emails = rag_system.process_emails(max_emails=request.max_emails)
        
        if not emails:
            return {
                "message": "No new emails found to process",
                "count": 0
            }
        
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
        chunked_docs = rag_system.chunk_documents(emails)
        rag_system.create_embeddings_and_store(chunked_docs)
        
        return {
            "message": f"Successfully processed {len(emails)} emails",
            "emails_processed": len(emails),
            "chunks_created": len(chunked_docs)
        }
        
    except Exception as e:
        logger.error(f"Email processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Email processing error: {str(e)}")

# System status endpoint
@app.get("/api/status")
async def get_status():
    """
    Get system status and information
    """
    try:
        # Test search to check knowledge base
        test_results = rag_system.search("wine", limit=1)
        
        return {
            "status": "healthy",
            "model": rag_system.llm_model_name,
            "embedding_model": rag_system.embedding_model_name,
            "knowledge_base_documents": len(test_results),
            "vector_database": "connected",
            "rag_system": "active"
        }
        
    except Exception as e:
        logger.error(f"Status check error: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

# Get conversation suggestions
@app.get("/api/suggestions")
async def get_suggestions():
    """
    Get suggested conversation starters
    """
    return {
        "suggestions": [
            "What wines do you recommend for a dinner party?",
            "How can I track my order?",
            "What is your return policy?",
            "Tell me about wine pairings",
            "What are your shipping options?",
            "Do you have any special offers?",
            "What's the difference between red and white wines?",
            "How should I store wine?",
            "What wines go well with seafood?",
            "Can you help me choose a gift wine?"
        ]
    }

def main():
    """Main function to start the API server"""
    import uvicorn
    
    print("🍷 Starting Wine Store RAG API Server...")
    print("🤖 RAG system initialized")
    print("📚 Knowledge base ready")
    print("🌐 API server starting...")
    print("-" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )

def main():
    """Main function to start the API server"""
    import uvicorn
    
    print("🍷 Starting Wine Store RAG API Server...")
    print("🤖 RAG system initialized")
    print("📚 Knowledge base ready")
    print("🌐 API server starting...")
    print("-" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )

if __name__ == "__main__":
    main()
