#!/usr/bin/env python3
"""
SIMPLE DEMO: How RAG Works (No Heavy Processing)
This shows you the concept without all the embedding/vector stuff
"""

import json

def simple_demo():
    """Show how RAG works with simple examples"""
    print("🍷 SIMPLE RAG DEMO - How It Works")
    print("=" * 50)
    
    # Load sample emails
    print("\n📧 STEP 1: Sample Wine Business Emails")
    print("-" * 40)
    
    with open("data/sample_wine_emails.json", 'r') as f:
        emails = json.load(f)
    
    print(f"✅ Loaded {len(emails)} sample emails")
    print("\nSample emails:")
    for i, email in enumerate(emails[:3], 1):
        print(f"  {i}. {email['subject']}")
        print(f"     Content: {email['full_body'][:80]}...")
    
    # Show how chunking works
    print("\n✂️  STEP 2: How Chunking Works")
    print("-" * 40)
    
    sample_email = emails[0]  # Anniversary dinner email
    print(f"Original email: {len(sample_email['full_body'])} characters")
    print(f"Content: {sample_email['full_body']}")
    
    # Simulate chunking
    chunks = [
        "Wine recommendation for anniversary dinner with filet mignon and lobster",
        "Budget around $100-150 total for romantic dinner",
        "Customer celebrating 10th anniversary next week"
    ]
    
    print(f"\nAfter chunking: {len(chunks)} chunks")
    for i, chunk in enumerate(chunks, 1):
        print(f"  Chunk {i}: {chunk}")
    
    # Show how search works
    print("\n🔍 STEP 3: How Search Works")
    print("-" * 40)
    
    query = "What wines pair with filet mignon?"
    print(f"Customer query: {query}")
    
    # Simulate finding relevant chunks
    relevant_chunks = [
        "Wine recommendation for anniversary dinner with filet mignon and lobster",
        "Budget around $100-150 total for romantic dinner"
    ]
    
    print(f"\nFound {len(relevant_chunks)} relevant chunks:")
    for i, chunk in enumerate(relevant_chunks, 1):
        print(f"  {i}. {chunk}")
    
    # Show how LLM uses the chunks
    print("\n🤖 STEP 4: How LLM Uses the Chunks")
    print("-" * 40)
    
    print("Instead of generic wine advice, the LLM now has:")
    print("  ✅ Specific customer context (anniversary dinner)")
    print("  ✅ Specific food pairing (filet mignon + lobster)")
    print("  ✅ Budget information ($100-150)")
    print("  ✅ Occasion details (romantic, 10th anniversary)")
    
    print("\nSo the LLM can give a personalized response like:")
    print("  'For your anniversary dinner with filet mignon and lobster, I recommend...'")
    print("  'Given your $100-150 budget, here are some excellent options...'")
    print("  'Since it's your 10th anniversary, you might want to consider...'")
    
    print("\n✅ DEMO COMPLETE!")
    print("\nThis is how RAG makes your chatbot smart about YOUR business!")

if __name__ == "__main__":
    simple_demo()
