#!/usr/bin/env python3
"""
RAG (Retrieval-Augmented Generation) System
Processes emails and PDFs, creates embeddings, enables semantic search
"""

import os
import sys
import json
from pathlib import Path
from typing import List, Dict, Any
import logging

# Add parent directory to path
parent_dir = Path(__file__).parent.parent
sys.path.append(str(parent_dir))
sys.path.append(str(parent_dir / "scripts"))

# LangChain imports
from langchain_ollama import OllamaLLM
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain.schema import Document

# Qdrant imports
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# PDF processing
from pypdf import PdfReader

# Gmail processing
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent / "scripts"))
from simple_gmail_reader import get_gmail_service, extract_email_body

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WineRAGSystem:
    def __init__(self, db_path: str = "./qdrant_db", model_name: str = "llama3.2:latest"):
        """
        Initialize the RAG system
        
        Args:
            db_path: Path to Qdrant database
            model_name: Ollama model to use for embeddings and generation
        """
        self.db_path = db_path
        self.model_name = model_name
        
        # Initialize Qdrant client
        self.client = QdrantClient(path=db_path)
        self.collection_name = "wine_knowledge"
        
        # Initialize Ollama components
        self.llm = OllamaLLM(model=model_name)
        self.embeddings = OllamaEmbeddings(model=model_name)
        
        # Text splitter for chunking documents
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        # Get embedding dimensions dynamically
        self.embedding_dim = self._get_embedding_dimensions()
        
        # Initialize collection if it doesn't exist
        self._initialize_collection()
        
        logger.info(f"RAG System initialized with model: {model_name}")
    
    def _get_embedding_dimensions(self) -> int:
        """Get the embedding dimensions for the current model"""
        try:
            # Test embedding to get dimensions
            test_embedding = self.embeddings.embed_query("test")
            return len(test_embedding)
        except Exception as e:
            logger.warning(f"Could not determine embedding dimensions, using default 384: {e}")
            return 384
    
    def _initialize_collection(self):
        """Initialize Qdrant collection if it doesn't exist"""
        try:
            # Check if collection exists
            collections = self.client.get_collections()
            collection_names = [col.name for col in collections.collections]
            
            if self.collection_name not in collection_names:
                # Create collection with correct embedding dimensions
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=self.embedding_dim, distance=Distance.COSINE)
                )
                logger.info(f"Created collection: {self.collection_name}")
            else:
                logger.info(f"Collection {self.collection_name} already exists")
                
        except Exception as e:
            logger.error(f"Error initializing collection: {e}")
            raise
    
    def process_emails(self, max_emails: int = 50) -> List[Dict[str, Any]]:
        """
        Process Gmail emails and extract content
        
        Args:
            max_emails: Maximum number of emails to process
            
        Returns:
            List of processed email documents
        """
        logger.info(f"Processing {max_emails} emails from Gmail...")
        
        try:
            service = get_gmail_service()
            
            # Get emails from Gmail
            results = service.users().messages().list(
                userId='me', 
                maxResults=max_emails
            ).execute()
            
            messages = results.get('messages', [])
            processed_emails = []
            
            for i, msg in enumerate(messages):
                try:
                    email = service.users().messages().get(
                        userId='me', 
                        id=msg['id'], 
                        format='full'
                    ).execute()
                    
                    # Extract email data
                    headers = email['payload']['headers']
                    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
                    sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
                    date = next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown')
                    
                    # Extract full email body
                    full_body = extract_email_body(email['payload'])
                    
                    # Create document
                    email_doc = {
                        'id': f"email_{msg['id']}",
                        'content': f"Subject: {subject}\nFrom: {sender}\nDate: {date}\n\n{full_body}",
                        'metadata': {
                            'type': 'email',
                            'subject': subject,
                            'sender': sender,
                            'date': date,
                            'gmail_id': msg['id'],
                            'snippet': email['snippet']
                        }
                    }
                    
                    processed_emails.append(email_doc)
                    logger.info(f"Processed email {i+1}/{len(messages)}: {subject[:50]}...")
                    
                except Exception as e:
                    logger.error(f"Error processing email {msg['id']}: {e}")
                    continue
            
            logger.info(f"Successfully processed {len(processed_emails)} emails")
            return processed_emails
            
        except Exception as e:
            logger.error(f"Error processing emails: {e}")
            raise
    
    def process_pdf(self, pdf_path: str) -> List[Dict[str, Any]]:
        """
        Process a PDF file and extract content
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            List of processed PDF documents
        """
        logger.info(f"Processing PDF: {pdf_path}")
        
        try:
            reader = PdfReader(pdf_path)
            documents = []
            
            for page_num, page in enumerate(reader.pages):
                text = page.extract_text()
                
                if text.strip():  # Only process non-empty pages
                    doc = {
                        'id': f"pdf_{Path(pdf_path).stem}_page_{page_num}",
                        'content': text,
                        'metadata': {
                            'type': 'pdf',
                            'source': pdf_path,
                            'page': page_num,
                            'filename': Path(pdf_path).name
                        }
                    }
                    documents.append(doc)
            
            logger.info(f"Extracted {len(documents)} pages from PDF")
            return documents
            
        except Exception as e:
            logger.error(f"Error processing PDF {pdf_path}: {e}")
            raise
    
    def chunk_documents(self, documents: List[Dict[str, Any]]) -> List[Document]:
        """
        Split documents into chunks for better retrieval
        
        Args:
            documents: List of document dictionaries
            
        Returns:
            List of LangChain Document objects
        """
        logger.info(f"Chunking {len(documents)} documents...")
        
        chunked_docs = []
        
        for doc in documents:
            # Create LangChain Document
            langchain_doc = Document(
                page_content=doc['content'],
                metadata=doc['metadata']
            )
            
            # Split into chunks
            chunks = self.text_splitter.split_documents([langchain_doc])
            
            # Add original document ID to each chunk
            for i, chunk in enumerate(chunks):
                chunk.metadata['chunk_id'] = f"{doc['id']}_chunk_{i}"
                chunk.metadata['original_id'] = doc['id']
            
            chunked_docs.extend(chunks)
        
        logger.info(f"Created {len(chunked_docs)} chunks from {len(documents)} documents")
        return chunked_docs
    
    def create_embeddings_and_store(self, documents: List[Document]):
        """
        Create embeddings for documents and store in Qdrant
        
        Args:
            documents: List of LangChain Document objects
        """
        logger.info(f"Creating embeddings for {len(documents)} documents...")
        
        try:
            points = []
            
            for i, doc in enumerate(documents):
                # Create embedding
                embedding = self.embeddings.embed_query(doc.page_content)
                
                # Create point for Qdrant
                point = PointStruct(
                    id=i + 1,  # Simple incremental ID
                    vector=embedding,
                    payload={
                        'content': doc.page_content,
                        'metadata': doc.metadata
                    }
                )
                points.append(point)
                
                if (i + 1) % 10 == 0:
                    logger.info(f"Created embeddings for {i + 1}/{len(documents)} documents")
            
            # Store in Qdrant
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            
            logger.info(f"Successfully stored {len(points)} embeddings in Qdrant")
            
        except Exception as e:
            logger.error(f"Error creating embeddings: {e}")
            raise
    
    def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for relevant documents using semantic similarity
        
        Args:
            query: Search query
            limit: Maximum number of results
            
        Returns:
            List of relevant documents with scores
        """
        logger.info(f"Searching for: {query}")
        
        try:
            # Create embedding for query
            query_embedding = self.embeddings.embed_query(query)
            
            # Search in Qdrant with much higher limit to ensure we get wine products
            search_results = self.client.query_points(
                collection_name=self.collection_name,
                query=query_embedding,
                limit=50  # Get enough results to find wine products
            )
            
            # Format and filter results
            results = []
            wine_products = []
            other_docs = []
            
            for result in search_results.points:
                doc = {
                    'content': result.payload['content'],
                    'metadata': result.payload['metadata'],
                    'score': result.score
                }
                
                # Prioritize wine products
                if doc['metadata'].get('type') == 'wine_product':
                    wine_products.append(doc)
                else:
                    other_docs.append(doc)
            
            # Always prioritize wine products when available
            if wine_products:
                # Take wine products first, then fill remaining slots with other docs
                results = wine_products[:limit] + other_docs[:max(0, limit - len(wine_products))]
            else:
                # No wine products found, return other docs
                results = other_docs[:limit]
            
            logger.info(f"Found {len(results)} relevant documents ({len(wine_products)} wine products)")
            return results
            
        except Exception as e:
            logger.error(f"Error searching: {e}")
            raise
    
    def generate_response(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        """
        Generate a response using the LLM with retrieved context
        
        Args:
            query: User query
            context_docs: Retrieved relevant documents
            
        Returns:
            Generated response
        """
        logger.info(f"Generating response for: {query}")
        
        try:
            # Separate wine products from other documents
            wine_products = [doc for doc in context_docs if doc['metadata'].get('type') == 'wine_product']
            other_docs = [doc for doc in context_docs if doc['metadata'].get('type') != 'wine_product']
            
            # Prepare focused context
            context_parts = []
            
            # Add wine products first (most important)
            if wine_products:
                context_parts.append("WINE PRODUCTS:")
                for doc in wine_products:
                    context_parts.append(f"- {doc['content']}")
            
            # Add other relevant info (limited)
            if other_docs and len(wine_products) < 3:  # Only if we don't have enough wine products
                context_parts.append("\nADDITIONAL INFORMATION:")
                for doc in other_docs[:2]:  # Limit to 2 other documents
                    context_parts.append(f"- {doc['content']}")
            
            context = "\n".join(context_parts)
            
            # Create focused prompt
            prompt = f"""You are a wine store customer service assistant. Answer the user's question concisely and directly.

CONTEXT:
{context}

USER QUESTION: {query}

INSTRUCTIONS:
- If asking about specific wines, focus on the wine products listed above
- Keep responses concise and to the point
- If we have the wines they're asking about, say so directly
- Don't include irrelevant information about return policies or wine clubs unless specifically asked
- If you don't have specific information, say so clearly

RESPONSE:"""

            # Generate response
            response = self.llm.invoke(prompt)
            
            logger.info("Generated response successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return f"I apologize, but I encountered an error while generating a response: {str(e)}"
    
    def query(self, question: str, limit: int = 3) -> Dict[str, Any]:
        """
        Complete RAG pipeline: search + generate response
        
        Args:
            question: User question
            limit: Number of documents to retrieve
            
        Returns:
            Dictionary with response and retrieved documents
        """
        # Search for relevant documents
        relevant_docs = self.search(question, limit=limit)
        
        # Generate response
        response = self.generate_response(question, relevant_docs)
        
        return {
            'response': response,
            'relevant_documents': relevant_docs,
            'query': question
        }

def main():
    """Test the RAG system"""
    print("🍷 Initializing Wine RAG System...")
    
    # Initialize RAG system
    rag = WineRAGSystem()
    
    # Test with a simple query
    test_query = "What wines do you recommend for a dinner party?"
    print(f"\n🔍 Testing query: {test_query}")
    
    result = rag.query(test_query)
    
    print(f"\n🤖 Response: {result['response']}")
    print(f"\n📚 Retrieved {len(result['relevant_documents'])} relevant documents")
    
    for i, doc in enumerate(result['relevant_documents'], 1):
        print(f"\n{i}. Score: {doc['score']:.3f}")
        print(f"   Type: {doc['metadata'].get('type', 'unknown')}")
        print(f"   Content: {doc['content'][:100]}...")

if __name__ == "__main__":
    main()
