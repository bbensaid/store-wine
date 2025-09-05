#!/usr/bin/env python3
"""
CONVERSATION DEMO: How RAG Works with Complete Customer Conversations
This processes both customer questions AND business responses
"""

import json
import sys
from pathlib import Path

# Add parent directory to path
parent_dir = Path(__file__).parent
sys.path.append(str(parent_dir))

from llm_scripts.rag_system import WineRAGSystem

def conversation_demo():
    """Process complete customer conversations"""
    print("🍷 CONVERSATION DEMO - Complete Customer Interactions")
    print("=" * 60)
    
    # Load conversation data
    print("\n📧 STEP 1: Loading Complete Conversations")
    print("-" * 50)
    
    with open("data/sample_wine_conversations.json", 'r') as f:
        conversations = json.load(f)
    
    print(f"✅ Loaded {len(conversations)} complete conversations")
    print("\nSample conversations:")
    for i, conv in enumerate(conversations[:3], 1):
        print(f"  {i}. Customer: {conv['customer_email']['subject']}")
        print(f"     Business: {conv['business_response']['subject']}")
    
    # Convert to documents (both questions and answers)
    print("\n📄 STEP 2: Converting Conversations to Searchable Documents")
    print("-" * 50)
    
    documents = []
    for conv in conversations:
        # Create document for customer question
        customer_doc = {
            'id': f"{conv['id']}_customer",
            'content': f"Customer Question: {conv['customer_email']['subject']}\n\n{conv['customer_email']['body']}",
            'metadata': {
                'type': 'customer_question',
                'conversation_id': conv['id'],
                'subject': conv['customer_email']['subject']
            }
        }
        documents.append(customer_doc)
        
        # Create document for business response
        business_doc = {
            'id': f"{conv['id']}_business",
            'content': f"Business Response: {conv['business_response']['subject']}\n\n{conv['business_response']['body']}",
            'metadata': {
                'type': 'business_response',
                'conversation_id': conv['id'],
                'subject': conv['business_response']['subject']
            }
        }
        documents.append(business_doc)
    
    print(f"✅ Created {len(documents)} searchable documents")
    print(f"   - {len(conversations)} customer questions")
    print(f"   - {len(conversations)} business responses")
    
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
    print("✅ Complete conversations stored in vector database")
    
    # Test searches
    print("\n🔍 STEP 6: Testing Knowledge Base with Real Conversations")
    print("-" * 50)
    
    test_queries = [
        "What wines pair with filet mignon for anniversary dinner?",
        "What's your return policy for incorrect orders?",
        "Do you ship to Canada and what are the costs?",
        "How should I store my wine collection?",
        "What wine tasting events do you have?",
        "Tell me about your wine club membership"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        results = rag.search(query, limit=3)
        print(f"   Found {len(results)} relevant conversation chunks:")
        
        for i, result in enumerate(results, 1):
            doc_type = result['metadata']['type']
            score = result['score']
            content_preview = result['content'][:80] + "..."
            print(f"   {i}. [{doc_type}] Score: {score:.3f}")
            print(f"      {content_preview}")
    
    # Test full RAG response
    print("\n🤖 STEP 7: Testing Full RAG Response with Real Conversations")
    print("-" * 50)
    
    query = "I'm celebrating my anniversary with filet mignon and need wine recommendations. What do you suggest?"
    print(f"Query: {query}")
    
    # Get relevant documents
    relevant_docs = rag.search(query, limit=3)
    print(f"\nFound {len(relevant_docs)} relevant conversation chunks:")
    for i, doc in enumerate(relevant_docs, 1):
        doc_type = doc['metadata']['type']
        score = doc['score']
        print(f"  {i}. [{doc_type}] Score: {score:.3f}")
    
    # Generate response using RAG
    print(f"\n⏳ Generating RAG response using real business conversations...")
    response = rag.generate_response(query, relevant_docs)
    print(f"\n🤖 RAG Response (based on real business conversations):")
    print(f"   {response}")
    
    print("\n✅ CONVERSATION DEMO COMPLETE!")
    print("Now your chatbot has access to real customer questions AND your business responses!")
    print("This means it can give answers based on how you actually respond to customers!")

if __name__ == "__main__":
    conversation_demo()
