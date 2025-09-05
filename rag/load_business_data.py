#!/usr/bin/env python3
"""
Easy-to-use script for loading your wine business documents into the RAG system
This script will help you build a comprehensive knowledge base for your chatbot
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Any

# Add parent directory to path
parent_dir = Path(__file__).parent
sys.path.append(str(parent_dir))

from llm_scripts.process_data import build_knowledge_base, load_existing_emails, process_pdf_directory
from llm_scripts.rag_system import WineRAGSystem

def check_existing_data():
    """Check what data is already available"""
    print("🔍 Checking existing data...")
    print("=" * 50)
    
    # Check email data
    data_dir = Path("data")
    email_files = [
        "customer_emails.json",
        "full_50_emails.json", 
        "full_emails.json",
        "my_50_emails.json",
        "my_emails.json"
    ]
    
    email_count = 0
    for email_file in email_files:
        file_path = data_dir / email_file
        if file_path.exists():
            try:
                import json
                with open(file_path, 'r') as f:
                    emails = json.load(f)
                email_count += len(emails)
                print(f"  ✅ {email_file}: {len(emails)} emails")
            except:
                print(f"  ⚠️  {email_file}: Error reading file")
        else:
            print(f"  ❌ {email_file}: Not found")
    
    # Check PDF data
    pdf_dir = Path("pdfs")
    pdf_files = list(pdf_dir.glob("*.pdf")) if pdf_dir.exists() else []
    print(f"  📄 PDF files: {len(pdf_files)} found")
    for pdf_file in pdf_files:
        print(f"    - {pdf_file.name}")
    
    # Check vector database
    qdrant_dir = Path("qdrant_db")
    if qdrant_dir.exists():
        print(f"  🗄️  Vector database: Exists")
    else:
        print(f"  ❌ Vector database: Not found")
    
    print(f"\n📊 Total emails available: {email_count}")
    print(f"📄 Total PDF files: {len(pdf_files)}")
    
    return email_count, len(pdf_files)

def load_pdf_documents():
    """Load PDF documents into the knowledge base"""
    print("\n📄 Loading PDF Documents...")
    print("=" * 50)
    
    pdf_dir = Path("pdfs")
    if not pdf_dir.exists():
        print("❌ PDF directory not found. Please create 'rag/pdfs/' and add your PDF files.")
        return []
    
    pdf_files = list(pdf_dir.glob("*.pdf"))
    if not pdf_files:
        print("❌ No PDF files found in 'rag/pdfs/' directory.")
        print("💡 Add your wine catalogs, product sheets, or other business documents here.")
        return []
    
    print(f"Found {len(pdf_files)} PDF files:")
    for pdf_file in pdf_files:
        print(f"  - {pdf_file.name}")
    
    # Process PDFs
    pdf_docs = process_pdf_directory()
    return pdf_docs

def load_email_documents():
    """Load email documents into the knowledge base"""
    print("\n📧 Loading Email Documents...")
    print("=" * 50)
    
    email_docs = load_existing_emails()
    return email_docs

def build_complete_knowledge_base():
    """Build the complete knowledge base from all available sources"""
    print("🏗️  Building Complete Wine Store Knowledge Base...")
    print("=" * 60)
    
    # Check existing data
    email_count, pdf_count = check_existing_data()
    
    if email_count == 0 and pdf_count == 0:
        print("\n❌ No documents found to process!")
        print("💡 Please add some documents first:")
        print("   - Add PDF files to 'rag/pdfs/' directory")
        print("   - Or set up Gmail API to fetch emails")
        return False
    
    # Initialize RAG system
    print("\n🤖 Initializing RAG system...")
    rag = WineRAGSystem()
    
    # Load all documents
    all_documents = []
    
    # Load emails
    if email_count > 0:
        email_docs = load_email_documents()
        all_documents.extend(email_docs)
    
    # Load PDFs
    if pdf_count > 0:
        pdf_docs = load_pdf_documents()
        all_documents.extend(pdf_docs)
    
    if not all_documents:
        print("❌ No documents could be loaded!")
        return False
    
    print(f"\n📚 Total documents loaded: {len(all_documents)}")
    
    # Convert to LangChain documents
    from langchain.schema import Document
    langchain_docs = []
    
    for doc in all_documents:
        langchain_doc = Document(
            page_content=doc['content'],
            metadata=doc['metadata']
        )
        langchain_docs.append(langchain_doc)
    
    # Chunk documents
    print("\n✂️  Chunking documents...")
    chunked_docs = rag.chunk_documents(all_documents)
    print(f"📦 Created {len(chunked_docs)} document chunks")
    
    # Create embeddings and store in vector database
    print("\n🔢 Creating embeddings and storing in vector database...")
    rag.create_embeddings_and_store(chunked_docs)
    
    print("\n✅ Knowledge base built successfully!")
    print(f"📊 Stored {len(chunked_docs)} document chunks in vector database")
    
    return True

def test_knowledge_base():
    """Test the knowledge base with wine business queries"""
    print("\n🧪 Testing Knowledge Base...")
    print("=" * 50)
    
    rag = WineRAGSystem()
    
    # Test queries specific to wine business
    test_queries = [
        "What wines do you recommend for a dinner party?",
        "How can I track my wine order?",
        "What is your return policy for wine?",
        "Tell me about wine storage recommendations",
        "What wines pair well with seafood?",
        "How long does shipping take?",
        "What are your most popular wines?",
        "Do you offer wine tastings?"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        try:
            results = rag.search(query, limit=3)
            print(f"   Found {len(results)} relevant documents")
            for i, result in enumerate(results, 1):
                doc_type = result['metadata'].get('type', 'unknown')
                score = result['score']
                print(f"   {i}. [{doc_type}] Score: {score:.3f}")
                # Show a snippet of the content
                content = result['content'][:100] + "..." if len(result['content']) > 100 else result['content']
                print(f"      Content: {content}")
        except Exception as e:
            print(f"   ❌ Error: {e}")

def main():
    """Main function"""
    print("🍷 Wine Store RAG Knowledge Base Builder")
    print("=" * 60)
    
    try:
        # Build the knowledge base
        success = build_complete_knowledge_base()
        
        if success:
            # Test the knowledge base
            test_knowledge_base()
            
            print("\n🎉 Knowledge base is ready!")
            print("💡 Your chatbot now has access to your business documents.")
            print("🚀 Start your API server with: python start_api.py")
        else:
            print("\n❌ Failed to build knowledge base.")
            print("💡 Please add some documents and try again.")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
