# 🍷 Wine Store RAG Chatbot System

A sophisticated customer support chatbot powered by Retrieval-Augmented Generation (RAG) that integrates with your Next.js wine e-commerce application.

## 🚀 Features

- **🤖 Intelligent Chatbot**: Powered by Ollama LLM with semantic search
- **📧 Email Integration**: Processes Gmail emails for customer interaction history
- **📄 PDF Processing**: Extracts knowledge from wine PDF documents
- **🔍 Semantic Search**: Finds relevant information using vector embeddings
- **🌐 Multiple Interfaces**: Gradio UI and FastAPI for Next.js integration
- **💾 Persistent Storage**: Vector database survives restarts

## 📁 Project Structure

```
rag/
├── llm_scripts/
│   ├── rag_system.py          # Core RAG system
│   └── process_data.py        # Data processing utilities
├── gradio_apps/
│   └── wine_chatbot.py        # Gradio chatbot interface
├── config/
│   ├── credentials.json       # Gmail API credentials
│   └── token.json            # Gmail API token
├── data/                      # Email data files
├── qdrant_db/                 # Persistent vector database
├── api_server.py              # FastAPI server for Next.js
├── start_chatbot.py           # Start Gradio chatbot
├── start_api.py               # Start API server
└── requirements.txt           # Python dependencies
```

## 🛠️ Installation

1. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Gmail API credentials:**

   - Place your `credentials.json` in the `config/` directory
   - Run the Gmail authentication process to generate `token.json`

3. **Verify Ollama is running:**
   ```bash
   ollama list
   ```

## 🚀 Usage

### Option 1: Gradio Chatbot Interface

Start the interactive chatbot interface:

```bash
python start_chatbot.py
```

This will launch a web interface at `http://localhost:7860` where you can:

- Chat with the AI assistant
- Process new emails
- Search the knowledge base
- Check system status

### Option 2: API Server for Next.js Integration

Start the FastAPI server:

```bash
python start_api.py
```

This will start the API server at `http://localhost:8000` with endpoints:

- `POST /api/chat` - Main chat endpoint
- `POST /api/search` - Search knowledge base
- `POST /api/emails/process` - Process new emails
- `GET /api/status` - System status
- `GET /api/suggestions` - Conversation starters

### API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## 🔧 Configuration

### Model Configuration

The system uses `llama3.2:latest` by default. To change the model:

1. Edit `llm_scripts/rag_system.py`
2. Change the `model_name` parameter in the `WineRAGSystem` constructor

### Vector Database

The system uses Qdrant for vector storage. The database is automatically created at `./qdrant_db/` and persists between restarts.

## 📊 Building the Knowledge Base

### Process Existing Emails

```python
from llm_scripts.process_data import build_knowledge_base
build_knowledge_base()
```

### Process New Emails

Use the Gradio interface or API endpoint to process new emails:

```bash
# Via API
curl -X POST "http://localhost:8000/api/emails/process" \
     -H "Content-Type: application/json" \
     -d '{"max_emails": 10}'
```

### Add PDF Documents

Place PDF files in a `pdfs/` directory and run:

```python
from llm_scripts.rag_system import WineRAGSystem
rag = WineRAGSystem()
pdf_docs = rag.process_pdf("path/to/wine_catalog.pdf")
```

## 🔗 Next.js Integration

### Frontend Integration

In your Next.js application, you can integrate with the API:

```javascript
// Example API call
const response = await fetch("http://localhost:8000/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "What wines do you recommend for a dinner party?",
    limit: 3,
  }),
});

const data = await response.json();
console.log(data.response);
```

### CORS Configuration

The API server is configured to accept requests from:

- `http://localhost:3000` (Next.js dev server)
- `http://127.0.0.1:3000`

## 🧪 Testing

### Test the RAG System

```bash
python -c "
from llm_scripts.rag_system import WineRAGSystem
rag = WineRAGSystem()
result = rag.query('What wines do you recommend?')
print(result['response'])
"
```

### Test API Endpoints

```bash
# Test chat endpoint
curl -X POST "http://localhost:8000/api/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello, what wines do you recommend?"}'

# Test status endpoint
curl "http://localhost:8000/api/status"
```

## 🐛 Troubleshooting

### Common Issues

1. **"No module named 'gradio'"**

   ```bash
   pip install gradio fastapi uvicorn
   ```

2. **"Storage folder is already accessed"**

   - Only one instance of the RAG system can access the database at a time
   - Stop other instances before starting a new one

3. **"No such file or directory: 'credentials.json'"**

   - Ensure Gmail API credentials are in the `config/` directory
   - Run the Gmail authentication process

4. **"Ollama connection failed"**
   - Ensure Ollama is running: `ollama serve`
   - Check if the model is available: `ollama list`

### Logs

The system provides detailed logging. Check the console output for:

- RAG system initialization
- Email processing status
- Vector database operations
- API request/response logs

## 🔄 Development Workflow

1. **Start Ollama**: `ollama serve`
2. **Start API Server**: `python start_api.py`
3. **Start Next.js App**: `npm run dev` (in your wine_store directory)
4. **Test Integration**: Use the API endpoints in your Next.js app

## 📈 Performance Tips

- **Batch Processing**: Process emails in batches for better performance
- **Model Selection**: Use smaller models for faster responses
- **Caching**: Implement response caching for frequently asked questions
- **Load Balancing**: Use multiple API server instances for high traffic

## 🚀 Production Deployment

For production deployment:

1. **Use a production ASGI server** (e.g., Gunicorn with Uvicorn workers)
2. **Set up proper CORS** for your production domain
3. **Use environment variables** for configuration
4. **Implement proper logging** and monitoring
5. **Set up database backups** for the vector database

## 📝 License

This project is part of your wine store application. Customize as needed for your business requirements.

---

**Ready to revolutionize your customer support with AI! 🍷🤖**
