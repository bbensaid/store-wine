#!/usr/bin/env python3
"""
DEMO: How RAG Works with Your Wine Business
This script shows you exactly how the RAG system processes your data
"""

import json
import sys
from pathlib import Path

# Add parent directory to path
parent_dir = Path(__file__).parent
sys.path.append(str(parent_dir))

from llm_scripts.rag_system import WineRAGSystem

def demo_step_by_step():
    """Show exactly how RAG works step by step"""
    print("🍷 RAG SYSTEM DEMO - How It Works")
    print("=" * 60)
    
    # Step 1: Load sample emails
    print("\n📧 STEP 1: Loading Sample Wine Business Emails")
    print("-" * 50)
    
    with open("data/sample_wine_emails.json", 'r') as f:
        emails = json.load(f)
    
    print(f"✅ Loaded {len(emails)} sample emails")
    print("Sample email subjects:")
    for i, email in enumerate(emails[:3], 1):
        print(f"  {i}. {email['subject']}")
    
    # Step 2: Convert to documents
    print("\n📄 STEP 2: Converting Emails to Documents")
    print("-" * 50)
    
    documents = []
    for email in emails:
        doc = {
            'id': f"email_{email['id']}",
            'content': f"Subject: {email['subject']}\nFrom: {email['from']}\nDate: {email['date']}\n\n{email['full_body']}",
            'metadata': {
                'type': 'email',
                'subject': email['subject'],
                'sender': email['from'],
                'date': email['date']
            }
        }
        documents.append(doc)
    
    print(f"✅ Created {len(documents)} documents")
    print("Sample document content:")
    print(f"  Subject: {documents[0]['metadata']['subject']}")
    print(f"  Content preview: {documents[0]['content'][:100]}...")
    
    # Step 3: Chunk documents
    print("\n✂️  STEP 3: Chunking Documents")
    print("-" * 50)
    
    rag = WineRAGSystem()
    chunked_docs = rag.chunk_documents(documents)
    
    print(f"✅ Created {len(chunked_docs)} chunks from {len(documents)} documents")
    print("Sample chunk:")
    print(f"  Content: {chunked_docs[0]['content'][:150]}...")
    print(f"  Metadata: {chunked_docs[0]['metadata']}")
    
    # Step 4: Create embeddings and store
    print("\n🔢 STEP 4: Creating Embeddings and Storing")
    print("-" * 50)
    
    rag.create_embeddings_and_store(chunked_docs)
    print("✅ Documents stored in vector database")
    
    # Step 5: Test searches
    print("\n🔍 STEP 5: Testing Searches")
    print("-" * 50)
    
    test_queries = [
        "What wines pair well with filet mignon?",
        "What's your return policy?",
        "Do you ship to Canada?",
        "What wine storage advice do you have?"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        results = rag.search(query, limit=2)
        print(f"   Found {len(results)} relevant chunks:")
        
        for i, result in enumerate(results, 1):
            print(f"   {i}. Score: {result['score']:.3f}")
            print(f"      Subject: {result['metadata']['subject']}")
            print(f"      Content: {result['content'][:100]}...")
    
    # Step 6: Test full RAG response
    print("\n🤖 STEP 6: Testing Full RAG Response")
    print("-" * 50)
    
    query = "What wines do you recommend for a romantic anniversary dinner with filet mignon?"
    print(f"Query: {query}")
    
    # Get relevant documents
    relevant_docs = rag.search(query, limit=3)
    print(f"\nFound {len(relevant_docs)} relevant documents:")
    for i, doc in enumerate(relevant_docs, 1):
        print(f"  {i}. {doc['metadata']['subject']} (Score: {doc['score']:.3f})")
    
    # Generate response using RAG
    response = rag.generate_response(query, relevant_docs)
    print(f"\n🤖 RAG Response:")
    print(f"   {response}")
    
    print("\n✅ DEMO COMPLETE!")
    print("Now your chatbot will use this business data instead of generic responses!")

if __name__ == "__main__":
    demo_step_by_step()
