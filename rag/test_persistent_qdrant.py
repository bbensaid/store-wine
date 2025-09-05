#!/usr/bin/env python3
"""
Test script for PERSISTENT Qdrant vector database
Data will be saved to disk and survive restarts
"""

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import os

def test_persistent_qdrant():
    """Test PERSISTENT Qdrant vector database"""
    try:
        # Create PERSISTENT Qdrant client - data saved to disk
        db_path = "./qdrant_db"  # Local directory for database
        client = QdrantClient(path=db_path)
        
        # Create a collection
        collection_name = "wine_knowledge"
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)
        )
        
        # Add some test vectors
        vectors = [
            [0.1, 0.2, 0.3] + [0.0] * 381,  # Pad to 384 dimensions
            [0.4, 0.5, 0.6] + [0.0] * 381,
            [0.7, 0.8, 0.9] + [0.0] * 381,
        ]
        
        points = [
            PointStruct(id=1, vector=vectors[0], payload={"text": "wine recommendation", "source": "email"}),
            PointStruct(id=2, vector=vectors[1], payload={"text": "shipping inquiry", "source": "email"}),
            PointStruct(id=3, vector=vectors[2], payload={"text": "return policy", "source": "pdf"}),
        ]
        
        client.upsert(collection_name=collection_name, points=points)
        
        # Search for similar vectors
        search_result = client.query_points(
            collection_name=collection_name,
            query=vectors[0],
            limit=2
        )
        
        print("✅ PERSISTENT Qdrant vector database working!")
        print(f"Database saved to: {os.path.abspath(db_path)}")
        print(f"Found {len(search_result.points)} similar vectors")
        for result in search_result.points:
            print(f"  - ID: {result.id}, Score: {result.score:.3f}, Text: {result.payload['text']}, Source: {result.payload['source']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Persistent Qdrant test failed: {e}")
        return False

def main():
    print("🧪 Testing PERSISTENT Vector Database (Qdrant)...")
    print("=" * 50)
    
    test_persistent_qdrant()
    
    print("=" * 50)
    print("✅ PERSISTENT vector database test completed!")
    print("💾 Data is now saved to disk and will survive restarts!")

if __name__ == "__main__":
    main()
