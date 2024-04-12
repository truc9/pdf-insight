import chromadb

chroma_client = chromadb.Client()

collection = chroma_client.create_collection(name="pdf_insight_collection")

# Chroma will store your text, and handle tokenization, embedding, and indexing automatically.

