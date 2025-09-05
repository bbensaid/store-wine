#!/usr/bin/env python3
"""
Data processing script for the RAG system
Processes existing email data and prepares it for the knowledge base
"""

import json
import sys
from pathlib import Path
from typing import List, Dict, Any

# Add parent directory to path
parent_dir = Path(__file__).parent.parent
sys.path.append(str(parent_dir))

from llm_scripts.rag_system import WineRAGSystem

def load_existing_emails(data_dir: str = "data") -> List[Dict[str, Any]]:
    """
    Load existing email data from JSON files
    
    Args:
        data_dir: Directory containing email JSON files
        
    Returns:
        List of email documents
    """
    print(f"📧 Loading existing emails from {data_dir}/")
    
    data_path = Path(data_dir)
    email_files = [
        "customer_emails.json",
        "full_50_emails.json", 
        "full_emails.json",
        "my_50_emails.json",
        "my_emails.json"
    ]
    
    all_emails = []
    
    for email_file in email_files:
        file_path = data_path / email_file
        if file_path.exists():
            try:
                with open(file_path, 'r') as f:
                    emails = json.load(f)
                
                # Convert to our document format
                for email in emails:
                    doc = {
                        'id': f"existing_{email_file}_{email.get('id', 'unknown')}",
                        'content': f"Subject: {email.get('subject', 'No Subject')}\nFrom: {email.get('from', 'Unknown')}\nDate: {email.get('date', 'Unknown')}\n\n{email.get('full_body', email.get('snippet', ''))}",
                        'metadata': {
                            'type': 'email',
                            'source_file': email_file,
                            'subject': email.get('subject', 'No Subject'),
                            'sender': email.get('from', 'Unknown'),
                            'date': email.get('date', 'Unknown'),
                            'original_id': email.get('id', 'unknown')
                        }
                    }
                    all_emails.append(doc)
                
                print(f"  ✅ Loaded {len(emails)} emails from {email_file}")
                
            except Exception as e:
                print(f"  ❌ Error loading {email_file}: {e}")
        else:
            print(f"  ⚠️  File not found: {email_file}")
    
    print(f"📊 Total emails loaded: {len(all_emails)}")
    return all_emails

def process_pdf_directory(pdf_dir: str = "pdfs") -> List[Dict[str, Any]]:
    """
    Process all PDF files in a directory
    
    Args:
        pdf_dir: Directory containing PDF files
        
    Returns:
        List of PDF documents
    """
    print(f"📄 Processing PDFs from {pdf_dir}/")
    
    pdf_path = Path(pdf_dir)
    if not pdf_path.exists():
        print(f"  ⚠️  PDF directory not found: {pdf_dir}")
        return []
    
    pdf_files = list(pdf_path.glob("*.pdf"))
    
    if not pdf_files:
        print(f"  ⚠️  No PDF files found in {pdf_dir}")
        return []
    
    all_pdfs = []
    
    for pdf_file in pdf_files:
        try:
            # Use the RAG system to process the PDF
            rag = WineRAGSystem()
            pdf_docs = rag.process_pdf(str(pdf_file))
            all_pdfs.extend(pdf_docs)
            print(f"  ✅ Processed {pdf_file.name}: {len(pdf_docs)} pages")
            
        except Exception as e:
            print(f"  ❌ Error processing {pdf_file.name}: {e}")
    
    print(f"📊 Total PDF pages processed: {len(all_pdfs)}")
    return all_pdfs

def build_knowledge_base():
    """
    Build the complete knowledge base from emails and PDFs
    """
    print("🏗️  Building Wine Store Knowledge Base...")
    print("=" * 50)
    
    # Initialize RAG system
    rag = WineRAGSystem()
    
    # Load existing emails
    email_docs = load_existing_emails()
    
    # Process PDFs (if any)
    pdf_docs = process_pdf_directory()
    
    # Combine all documents
    all_documents = email_docs + pdf_docs
    
    if not all_documents:
        print("❌ No documents found to process!")
        return
    
    print(f"\n📚 Total documents to process: {len(all_documents)}")
    print(f"  - Emails: {len(email_docs)}")
    print(f"  - PDF pages: {len(pdf_docs)}")
    
    # Convert to LangChain documents and chunk
    from langchain.schema import Document
    langchain_docs = []
    
    for doc in all_documents:
        langchain_doc = Document(
            page_content=doc['content'],
            metadata=doc['metadata']
        )
        langchain_docs.append(langchain_doc)
    
    # Chunk documents
    chunked_docs = rag.chunk_documents(all_documents)
    
    # Create embeddings and store in vector database
    print(f"\n🔢 Creating embeddings for {len(chunked_docs)} chunks...")
    rag.create_embeddings_and_store(chunked_docs)
    
    print("\n✅ Knowledge base built successfully!")
    print(f"📊 Stored {len(chunked_docs)} document chunks in vector database")
    
    # Test the knowledge base
    print("\n🧪 Testing knowledge base...")
    test_queries = [
        "What wines do you recommend?",
        "How can I track my order?",
        "What is your return policy?",
        "Tell me about wine pairings"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        results = rag.search(query, limit=2)
        print(f"   Found {len(results)} relevant documents")
        for i, result in enumerate(results, 1):
            print(f"   {i}. Score: {result['score']:.3f} - {result['metadata'].get('type', 'unknown')}")

def main():
    """Main function to build the knowledge base"""
    try:
        build_knowledge_base()
    except Exception as e:
        print(f"❌ Error building knowledge base: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
