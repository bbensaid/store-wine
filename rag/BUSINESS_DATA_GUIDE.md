# 🍷 Complete Guide: Loading Your Wine Business Data into RAG

This guide will help you load your business-specific documents (PDFs, emails, etc.) into your RAG chatbot system to make it truly tailored to your wine business.

## 📋 What You Need

### 1. **PDF Documents** (Wine Catalogs, Product Sheets, etc.)

- Wine catalogs and product descriptions
- Wine pairing guides
- Storage and serving instructions
- Company policies (shipping, returns, etc.)
- Wine education materials

### 2. **Email Data** (Customer Interactions)

- Customer support emails
- Order confirmations and updates
- Wine recommendations sent to customers
- FAQ responses

### 3. **Gmail API Setup** (Optional - for live email processing)

- Gmail API credentials
- Access to your business email

## 🚀 Step-by-Step Setup

### **Step 1: Add Your PDF Documents**

1. **Create the PDF directory** (already done):

   ```bash
   mkdir -p rag/pdfs
   ```

2. **Add your PDF files** to `rag/pdfs/`:

   - Copy your wine catalogs, product sheets, etc.
   - Name them descriptively (e.g., `wine_catalog_2024.pdf`, `pairing_guide.pdf`)

3. **Supported PDF types**:
   - Wine catalogs and product descriptions
   - Wine pairing guides
   - Storage and serving instructions
   - Company policies
   - Wine education materials

### **Step 2: Set Up Gmail API (Optional)**

If you want to process emails from your Gmail account:

1. **Get Gmail API credentials**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Gmail API
   - Create credentials (OAuth 2.0 Client ID)
   - Download the credentials file

2. **Add credentials to RAG system**:

   ```bash
   # Place your credentials file in:
   rag/config/credentials.json
   ```

3. **Run Gmail authentication**:
   ```bash
   cd rag
   python scripts/test_credentials.py
   ```

### **Step 3: Load Your Business Data**

Run the easy-to-use data loading script:

```bash
cd rag
python load_business_data.py
```

This script will:

- ✅ Check what data you have available
- ✅ Process all PDF files in `rag/pdfs/`
- ✅ Load existing email data from `rag/data/`
- ✅ Build the complete knowledge base
- ✅ Test the system with wine business queries

### **Step 4: Test Your Knowledge Base**

After loading data, test with these queries:

```bash
# Test via API
curl -X POST "http://localhost:8000/api/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "What wines do you recommend for a dinner party?"}'

curl -X POST "http://localhost:8000/api/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "What is your return policy?"}'

curl -X POST "http://localhost:8000/api/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "How should I store wine?"}'
```

## 📁 File Structure

```
rag/
├── pdfs/                          # ← Add your PDF files here
│   ├── wine_catalog_2024.pdf
│   ├── pairing_guide.pdf
│   └── storage_instructions.pdf
├── data/                          # ← Email data (already exists)
│   ├── customer_emails.json
│   ├── full_emails.json
│   └── ...
├── config/                        # ← Gmail API credentials
│   ├── credentials.json          # ← Add your Gmail API credentials
│   └── token.json
├── load_business_data.py          # ← Easy-to-use loading script
└── qdrant_db/                     # ← Vector database (auto-created)
```

## 🔧 Advanced Configuration

### **Customize PDF Processing**

Edit `rag/llm_scripts/rag_system.py` to customize PDF processing:

```python
def process_pdf(self, pdf_path: str, chunk_size: int = 1000, chunk_overlap: int = 200):
    # Adjust chunk_size and chunk_overlap for your documents
```

### **Customize Email Processing**

Edit `rag/llm_scripts/process_data.py` to customize email processing:

```python
def load_existing_emails(self, data_dir: str = "data"):
    # Add your custom email processing logic
```

### **Add Custom Business Data**

Create custom data loaders in `rag/llm_scripts/process_data.py`:

```python
def load_custom_business_data():
    # Add your custom business data processing
    pass
```

## 🧪 Testing Your Knowledge Base

### **Test Queries for Wine Business**

```python
# Test these queries to see if your data is loaded correctly
test_queries = [
    "What wines do you recommend for a dinner party?",
    "How can I track my wine order?",
    "What is your return policy for wine?",
    "Tell me about wine storage recommendations",
    "What wines pair well with seafood?",
    "How long does shipping take?",
    "What are your most popular wines?",
    "Do you offer wine tastings?",
    "What is your shipping policy?",
    "How do I contact customer support?"
]
```

### **Check Knowledge Base Status**

```bash
# Check system status
curl -X GET "http://localhost:8000/api/status"

# Search knowledge base
curl -X POST "http://localhost:8000/api/search" \
     -H "Content-Type: application/json" \
     -d '{"query": "wine recommendations", "limit": 5}'
```

## 🚨 Troubleshooting

### **Common Issues**

1. **No PDFs found**:

   - Make sure PDFs are in `rag/pdfs/` directory
   - Check file permissions

2. **Gmail API errors**:

   - Verify credentials file is in `rag/config/credentials.json`
   - Run authentication: `python scripts/test_credentials.py`

3. **Vector database errors**:

   - Delete `rag/qdrant_db/` and rebuild
   - Check disk space

4. **Memory issues**:
   - Process fewer documents at once
   - Increase chunk size to reduce total chunks

### **Reset Knowledge Base**

```bash
# Delete existing knowledge base
rm -rf rag/qdrant_db/

# Rebuild from scratch
python load_business_data.py
```

## 📊 Monitoring Your Knowledge Base

### **Check Document Count**

```bash
# Check how many documents are in your knowledge base
curl -X GET "http://localhost:8000/api/status"
```

### **Search Your Data**

```bash
# Search for specific information
curl -X POST "http://localhost:8000/api/search" \
     -H "Content-Type: application/json" \
     -d '{"query": "your search term", "limit": 10}'
```

## 🎯 Best Practices

### **For PDF Documents**

- Use high-quality, text-based PDFs (not scanned images)
- Include descriptive filenames
- Keep documents under 50MB each
- Use consistent formatting

### **For Email Data**

- Include both customer questions and your responses
- Keep email content relevant to wine business
- Remove sensitive information before processing

### **For Knowledge Base Maintenance**

- Regularly update with new products/policies
- Monitor chatbot responses for accuracy
- Add new documents as your business grows

## 🚀 Next Steps

1. **Add your PDF documents** to `rag/pdfs/`
2. **Run the data loading script**: `python load_business_data.py`
3. **Test your knowledge base** with wine business queries
4. **Start your API server**: `python start_api.py`
5. **Test the chatbot** in your Next.js app

Your RAG chatbot will now provide intelligent, business-specific responses based on your actual wine business data! 🍷🤖
