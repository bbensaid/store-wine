#!/usr/bin/env python3
"""
Test script for the RAG system
"""

import sys
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

def test_rag_initialization():
    """Test if RAG system can be initialized"""
    try:
        from llm_scripts.rag_system import WineRAGSystem
        rag = WineRAGSystem()
        print("✅ RAG system initialization successful")
        return True
    except Exception as e:
        print(f"❌ RAG system initialization failed: {e}")
        return False

def test_ollama_connection():
    """Test Ollama connection"""
    try:
        from llm_scripts.rag_system import WineRAGSystem
        rag = WineRAGSystem()
        
        # Test simple query
        response = rag.llm.invoke("Hello, respond with just 'Hi there!'")
        print(f"✅ Ollama connection successful: {response[:50]}...")
        return True
    except Exception as e:
        print(f"❌ Ollama connection failed: {e}")
        return False

def test_vector_database():
    """Test vector database operations"""
    try:
        from llm_scripts.rag_system import WineRAGSystem
        rag = WineRAGSystem()
        
        # Test search (should work even with empty database)
        results = rag.search("test query", limit=1)
        print(f"✅ Vector database operations successful")
        return True
    except Exception as e:
        print(f"❌ Vector database test failed: {e}")
        return False

def test_email_processing():
    """Test email processing functionality"""
    try:
        from llm_scripts.rag_system import WineRAGSystem
        rag = WineRAGSystem()
        
        # Test with a small number of emails
        emails = rag.process_emails(max_emails=2)
        print(f"✅ Email processing successful: {len(emails)} emails processed")
        return True
    except Exception as e:
        print(f"❌ Email processing failed: {e}")
        return False

def main():
    print("🧪 Testing RAG System Components...")
    print("=" * 50)
    
    tests = [
        ("RAG Initialization", test_rag_initialization),
        ("Ollama Connection", test_ollama_connection),
        ("Vector Database", test_vector_database),
        ("Email Processing", test_email_processing),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        if test_func():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ All tests passed! RAG system is ready.")
    else:
        print("❌ Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
