#!/usr/bin/env python3
"""
REAL DEMO: How RAG Works with Actual Business Knowledge
This processes real business data that will make the chatbot smarter
"""

import json
import sys
from pathlib import Path

# Add parent directory to path
parent_dir = Path(__file__).parent
sys.path.append(str(parent_dir))

from llm_scripts.rag_system import WineRAGSystem

def real_demo():
    """Process real business knowledge data"""
    print("🍷 REAL RAG DEMO - Processing Business Knowledge")
    print("=" * 60)
    
    # Load business knowledge data
    print("\n📚 STEP 1: Loading Business Knowledge Data")
    print("-" * 50)
    
    with open("data/sample_wine_business_data.json", 'r') as f:
        business_data = json.load(f)
    
    print(f"✅ Loaded {len(business_data)} business knowledge items")
    print("\nKnowledge categories:")
    for item in business_data:
        print(f"  - {item['type']}: {item['content'][:60]}...")
    
    # Convert to documents
    print("\n📄 STEP 2: Converting to Searchable Documents")
    print("-" * 50)
    
    documents = []
    for item in business_data:
        doc = {
            'id': item['id'],
            'content': item['content'],
            'metadata': item['metadata']
        }
        documents.append(doc)
    
    print(f"✅ Created {len(documents)} searchable documents")
    
    # Initialize RAG system
    print("\n🤖 STEP 3: Initializing RAG System")
    print("-" * 50)
    
    rag = WineRAGSystem()
    print("✅ RAG system initialized")
    
    # Chunk documents
    print("\n✂️  STEP 4: Chunking Documents")
    print("-" * 50)
    
    chunked_docs = rag.chunk_documents(documents)
    print(f"✅ Created {len(chunked_docs)} searchable chunks")
    
    # Create embeddings and store
    print("\n🔢 STEP 5: Creating Embeddings and Storing")
    print("-" * 50)
    print("⏳ This will take 1-2 minutes...")
    
    rag.create_embeddings_and_store(chunked_docs)
    print("✅ Business knowledge stored in vector database")
    
    # Test searches
    print("\n🔍 STEP 6: Testing Knowledge Base")
    print("-" * 50)
    
    test_queries = [
        "What wines pair with filet mignon?",
        "What's your return policy?",
        "Do you ship to Canada?",
        "How should I store wine?",
        "What wine tasting events do you have?",
        "Tell me about your wine club"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        results = rag.search(query, limit=2)
        print(f"   Found {len(results)} relevant knowledge items:")
        
        for i, result in enumerate(results, 1):
            print(f"   {i}. {result['metadata']['category']} (Score: {result['score']:.3f})")
            print(f"      {result['content'][:80]}...")
    
    # Test full RAG response
    print("\n🤖 STEP 7: Testing Full RAG Response")
    print("-" * 50)
    
    query = "What wines do you recommend for a romantic anniversary dinner with filet mignon?"
    print(f"Query: {query}")
    
    # Get relevant documents
    relevant_docs = rag.search(query, limit=3)
    print(f"\nFound {len(relevant_docs)} relevant knowledge items:")
    for i, doc in enumerate(relevant_docs, 1):
        print(f"  {i}. {doc['metadata']['category']} (Score: {doc['score']:.3f})")
    
    # Generate response using RAG
    print(f"\n⏳ Generating RAG response...")
    response = rag.generate_response(query, relevant_docs)
    print(f"\n🤖 RAG Response:")
    print(f"   {response}")
    
    print("\n✅ REAL DEMO COMPLETE!")
    print("Now your chatbot has actual business knowledge and will give specific, helpful responses!")

if __name__ == "__main__":
    real_demo()
