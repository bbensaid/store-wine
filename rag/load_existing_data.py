#!/usr/bin/env python3
"""
Load existing email data into the RAG system
This script works with the running API server
"""

import requests
import json
import time
from pathlib import Path

def load_existing_emails_via_api():
    """Load existing email data using the API server"""
    print("🍷 Loading Existing Email Data via API...")
    print("=" * 50)
    
    # Check if API server is running
    try:
        response = requests.get("http://localhost:8000/api/status")
        if response.status_code != 200:
            print("❌ API server is not running. Please start it first:")
            print("   python start_api.py")
            return False
    except:
        print("❌ Cannot connect to API server. Please start it first:")
        print("   python start_api.py")
        return False
    
    print("✅ API server is running")
    
    # Load email data from files
    data_dir = Path("data")
    email_files = [
        "customer_emails.json",
        "full_50_emails.json", 
        "full_emails.json",
        "my_50_emails.json",
        "my_emails.json"
    ]
    
    all_emails = []
    
    for email_file in email_files:
        file_path = data_dir / email_file
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
    
    print(f"\n📊 Total emails loaded: {len(all_emails)}")
    
    if not all_emails:
        print("❌ No email data found!")
        return False
    
    # Process emails in batches via API
    print("\n🔄 Processing emails via API...")
    
    # For now, we'll use the existing process_data.py approach
    # but we need to stop the API server first, process data, then restart
    
    print("\n⚠️  To load the email data, we need to:")
    print("1. Stop the API server (Ctrl+C)")
    print("2. Run: python load_business_data.py")
    print("3. Restart the API server: python start_api.py")
    
    return True

def test_current_knowledge_base():
    """Test what's currently in the knowledge base"""
    print("\n🧪 Testing Current Knowledge Base...")
    print("=" * 50)
    
    test_queries = [
        "What wines do you recommend?",
        "How can I track my order?",
        "What is your return policy?",
        "Tell me about wine storage",
        "What wines pair well with seafood?"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        try:
            response = requests.post(
                "http://localhost:8000/api/chat",
                json={"message": query, "limit": 3}
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"   Response: {data['response'][:100]}...")
                
                # Check if we got relevant documents
                if 'relevant_documents' in data:
                    print(f"   Found {len(data['relevant_documents'])} relevant documents")
                else:
                    print("   No relevant documents found (using base LLM)")
            else:
                print(f"   ❌ Error: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

def main():
    """Main function"""
    print("🍷 Wine Store RAG Data Loader")
    print("=" * 50)
    
    # Test current knowledge base
    test_current_knowledge_base()
    
    # Try to load existing data
    load_existing_emails_via_api()

if __name__ == "__main__":
    main()
