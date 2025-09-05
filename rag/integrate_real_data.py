#!/usr/bin/env python3
"""
REAL DATA INTEGRATION: Connect RAG with your actual Supabase database
This integrates your real wine products, reviews, and business data
"""

import json
import sys
import os
from pathlib import Path
import asyncio
from typing import List, Dict, Any
import asyncpg
? Should we migrate the whole darn Python shit to Typescript? 
# Add parent directory to path
parent_dir = Path(__file__).parent
sys.path.append(str(parent_dir))

# Import RAG system
from llm_scripts.rag_system import WineRAGSystem

# Database connection
async def get_db_connection():
    """Get database connection using DATABASE_URL"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL not found in environment variables")
        return None
    
    try:
        conn = await asyncpg.connect(database_url)
        return conn
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        return None

async def get_real_wine_data():
    """Get real wine data from your Supabase database"""
    print("🍷 Loading REAL Wine Data from Supabase...")
    print("-" * 50)
    
    conn = await get_db_connection()
    if not conn:
        return []
    
    try:
        # Get wines with all related data
        wines_query = """
        SELECT 
            w.id, w.name, w.type, w.grapes, w.elaborate, w.harmonize, 
            w.abv, w.body, w.acidity, w.price, w.code, w.featured,
            r.name as region_name, r.country
        FROM "Wine" w
        LEFT JOIN "Region" r ON w."regionId" = r.id
        LIMIT 100
        """
        
        wines = await conn.fetch(wines_query)
        print(f"✅ Loaded {len(wines)} real wines from database")
        
        # Get reviews for each wine
        reviews_query = """
        SELECT 
            r.id, r."wineId", r.rating, r."authorName", r.comment, 
            r.vintage, r."createdAt"
        FROM "Review" r
        WHERE r."wineId" = ANY($1)
        """
        
        wine_ids = [w['id'] for w in wines]
        reviews = await conn.fetch(reviews_query, wine_ids)
        
        # Group reviews by wine ID
        reviews_by_wine = {}
        for review in reviews:
            wine_id = review['wineId']
            if wine_id not in reviews_by_wine:
                reviews_by_wine[wine_id] = []
            reviews_by_wine[wine_id].append(review)
        
        # Convert to RAG documents
        wine_docs = []
        for wine in wines:
            wine_id = wine['id']
            wine_reviews = reviews_by_wine.get(wine_id, [])
            
            # Create comprehensive wine document
            wine_content = f"""
Wine: {wine['name']}
Type: {wine['type']}
Grapes: {wine['grapes']}
Description: {wine['elaborate'] or 'No description available'}
Food Pairing: {wine['harmonize']}
Alcohol Content: {wine['abv']}%
Body: {wine['body']}
Acidity: {wine['acidity']}
Price: ${wine['price'] / 100:.2f}
Region: {wine['region_name'] or 'Unknown'}
Country: {wine['country'] or 'Unknown'}
Product Code: {wine['code']}
Featured: {'Yes' if wine['featured'] else 'No'}
"""
            
            # Add review information
            if wine_reviews:
                wine_content += f"\nCustomer Reviews ({len(wine_reviews)} reviews):\n"
                avg_rating = sum(r['rating'] for r in wine_reviews) / len(wine_reviews)
                wine_content += f"Average Rating: {avg_rating:.1f}/5 stars\n"
                
                # Add individual reviews
                for review in wine_reviews[:3]:  # Top 3 reviews
                    wine_content += f"- {review['authorName']}: {review['rating']}/5 - {review['comment']}\n"
            
            wine_doc = {
                'id': f"wine_{wine['id']}",
                'content': wine_content,
                'metadata': {
                    'type': 'wine_product',
                    'wine_id': wine['id'],
                    'name': wine['name'],
                    'type': wine['type'],
                    'price': wine['price'],
                    'region': wine['region_name'] or 'Unknown',
                    'country': wine['country'] or 'Unknown',
                    'featured': wine['featured'],
                    'review_count': len(wine_reviews),
                    'average_rating': sum(r['rating'] for r in wine_reviews) / len(wine_reviews) if wine_reviews else 0
                }
            }
            wine_docs.append(wine_doc)
        
        print(f"✅ Created {len(wine_docs)} wine product documents")
        return wine_docs
        
    except Exception as e:
        print(f"❌ Error loading wine data: {e}")
        return []
    finally:
        await conn.close()

async def get_real_review_data():
    """Get real review data from your Supabase database"""
    print("\n📝 Loading REAL Review Data from Supabase...")
    print("-" * 50)
    
    conn = await get_db_connection()
    if not conn:
        return []
    
    try:
        # Get reviews with wine information
        reviews_query = """
        SELECT 
            r.id, r."wineId", r.rating, r."authorName", r.comment, 
            r.vintage, r."createdAt",
            w.name as wine_name, w.type as wine_type, w.price,
            reg.name as region_name, reg.country
        FROM "Review" r
        JOIN "Wine" w ON r."wineId" = w.id
        LEFT JOIN "Region" reg ON w."regionId" = reg.id
        LIMIT 200
        """
        
        reviews = await conn.fetch(reviews_query)
        print(f"✅ Loaded {len(reviews)} real reviews from database")
        
        # Convert to RAG documents
        review_docs = []
        for review in reviews:
            review_content = f"""
Customer Review for {review['wine_name']}:
Rating: {review['rating']}/5 stars
Reviewer: {review['authorName']}
Comment: {review['comment']}
Vintage: {review['vintage'] or 'Not specified'}
Date: {review['createdAt'].strftime('%Y-%m-%d')}

Wine Details:
- Type: {review['wine_type']}
- Region: {review['region_name'] or 'Unknown'}
- Country: {review['country'] or 'Unknown'}
- Price: ${review['price'] / 100:.2f}
"""
            
            review_doc = {
                'id': f"review_{review['id']}",
                'content': review_content,
                'metadata': {
                    'type': 'customer_review',
                    'review_id': review['id'],
                    'wine_id': review['wineId'],
                    'wine_name': review['wine_name'],
                    'rating': review['rating'],
                    'author': review['authorName'],
                    'vintage': review['vintage'],
                    'date': review['createdAt'].isoformat()
                }
            }
            review_docs.append(review_doc)
        
        print(f"✅ Created {len(review_docs)} review documents")
        return review_docs
        
    except Exception as e:
        print(f"❌ Error loading review data: {e}")
        return []
    finally:
        await conn.close()

def load_business_conversations():
    """Load business conversation data"""
    print("\n💬 Loading Business Conversation Data...")
    print("-" * 50)
    
    try:
        with open("data/sample_wine_conversations.json", 'r') as f:
            conversations = json.load(f)
        
        conversation_docs = []
        for conv in conversations:
            # Customer question document
            customer_doc = {
                'id': f"{conv['id']}_customer",
                'content': f"Customer Question: {conv['customer_email']['subject']}\n\n{conv['customer_email']['body']}",
                'metadata': {
                    'type': 'customer_question',
                    'conversation_id': conv['id'],
                    'subject': conv['customer_email']['subject']
                }
            }
            conversation_docs.append(customer_doc)
            
            # Business response document
            business_doc = {
                'id': f"{conv['id']}_business",
                'content': f"Business Response: {conv['business_response']['subject']}\n\n{conv['business_response']['body']}",
                'metadata': {
                    'type': 'business_response',
                    'conversation_id': conv['id'],
                    'subject': conv['business_response']['subject']
                }
            }
            conversation_docs.append(business_doc)
        
        print(f"✅ Created {len(conversation_docs)} conversation documents")
        return conversation_docs
        
    except Exception as e:
        print(f"❌ Error loading conversation data: {e}")
        return []

async def build_complete_rag_system():
    """Build the complete RAG system with all real data"""
    print("🏗️  Building Complete RAG System with REAL Data")
    print("=" * 60)
    
    # Initialize RAG system
    rag = WineRAGSystem()
    
    # Load all data sources
    all_documents = []
    
    # 1. Real wine products from Supabase
    wine_docs = await get_real_wine_data()
    all_documents.extend(wine_docs)
    
    # 2. Real reviews from Supabase
    review_docs = await get_real_review_data()
    all_documents.extend(review_docs)
    
    # 3. Business conversations
    conversation_docs = load_business_conversations()
    all_documents.extend(conversation_docs)
    
    print(f"\n📊 Total documents loaded: {len(all_documents)}")
    print(f"  - Wine products: {len(wine_docs)}")
    print(f"  - Customer reviews: {len(review_docs)}")
    print(f"  - Business conversations: {len(conversation_docs)}")
    
    if not all_documents:
        print("❌ No documents found!")
        return False
    
    # Chunk documents
    print("\n✂️  Chunking documents...")
    chunked_docs = rag.chunk_documents(all_documents)
    print(f"✅ Created {len(chunked_docs)} searchable chunks")
    
    # Create embeddings and store
    print("\n🔢 Creating embeddings and storing in vector database...")
    print("⏳ This will take 2-3 minutes...")
    
    rag.create_embeddings_and_store(chunked_docs)
    print("✅ Complete RAG system built with real data!")
    
    return True

async def test_real_rag_system():
    """Test the RAG system with real data"""
    print("\n🧪 Testing RAG System with Real Data")
    print("=" * 50)
    
    rag = WineRAGSystem()
    
    test_queries = [
        "What red wines do you have under $50?",
        "What are your best-rated wines?",
        "What wines pair well with seafood?",
        "What do customers say about your Chardonnay?",
        "What's your return policy?",
        "Do you have any Italian wines?"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        results = rag.search(query, limit=3)
        print(f"   Found {len(results)} relevant documents:")
        
        for i, result in enumerate(results, 1):
            doc_type = result['metadata']['type']
            score = result['score']
            print(f"   {i}. [{doc_type}] Score: {score:.3f}")
            
            if doc_type == 'wine_product':
                print(f"      Wine: {result['metadata']['name']} - ${result['metadata']['price']/100:.2f}")
            elif doc_type == 'customer_review':
                print(f"      Review: {result['metadata']['wine_name']} - {result['metadata']['rating']}/5 stars")
            elif doc_type == 'business_response':
                print(f"      Business: {result['metadata']['subject']}")
    
    # Test full RAG response
    print(f"\n🤖 Testing Full RAG Response...")
    query = "I'm looking for a good red wine under $100 for a dinner party. What do you recommend?"
    print(f"Query: {query}")
    
    relevant_docs = rag.search(query, limit=5)
    print(f"\nFound {len(relevant_docs)} relevant documents")
    
    response = rag.generate_response(query, relevant_docs)
    print(f"\n🤖 RAG Response (using your real wine data):")
    print(f"   {response}")

async def main():
    """Main function"""
    print("🍷 REAL DATA RAG INTEGRATION")
    print("=" * 60)
    
    try:
        # Build the complete system
        success = await build_complete_rag_system()
        
        if success:
            # Test the system
            await test_real_rag_system()
            
            print("\n✅ REAL DATA INTEGRATION COMPLETE!")
            print("Your RAG system now has access to:")
            print("  - Your actual wine products from Supabase")
            print("  - Real customer reviews and ratings")
            print("  - Your business conversation history")
            print("  - All integrated for intelligent responses!")
        else:
            print("\n❌ Failed to build RAG system")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())