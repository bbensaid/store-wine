#!/usr/bin/env python3
"""
Test script for the Wine Store Chatbot
"""

import sys
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

def test_chatbot_initialization():
    """Test if chatbot can be initialized"""
    try:
        from gradio_apps.wine_chatbot import WineChatbot
        bot = WineChatbot()
        print("✅ Chatbot initialization successful")
        return True
    except Exception as e:
        print(f"❌ Chatbot initialization failed: {e}")
        return False

def test_chat_functionality():
    """Test basic chat functionality"""
    try:
        from gradio_apps.wine_chatbot import WineChatbot
        bot = WineChatbot()
        
        # Test simple chat
        history = []
        history, _ = bot.chat("Hello, what wines do you recommend?", history)
        
        if history and len(history) > 0:
            print(f"✅ Chat functionality working: {history[0][1][:50]}...")
            return True
        else:
            print("❌ Chat functionality failed: No response generated")
            return False
            
    except Exception as e:
        print(f"❌ Chat functionality failed: {e}")
        return False

def test_api_server():
    """Test API server initialization"""
    try:
        from api_server import app
        print("✅ API server initialization successful")
        return True
    except Exception as e:
        print(f"❌ API server initialization failed: {e}")
        return False

def main():
    print("🧪 Testing Wine Store Chatbot Components...")
    print("=" * 50)
    
    tests = [
        ("Chatbot Initialization", test_chatbot_initialization),
        ("Chat Functionality", test_chat_functionality),
        ("API Server", test_api_server),
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
        print("✅ All tests passed! Chatbot is ready.")
        print("\n🚀 To start the chatbot:")
        print("   python start_chatbot.py")
        print("\n🚀 To start the API server:")
        print("   python start_api.py")
    else:
        print("❌ Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()