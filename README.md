# pdf-insight

Understanding your PDF using LLM

Using RAG
- Indexing: pipeline ingesting data from source and index it (OFFLINE)
    - Load: data using DocumentLoader
    - Split: using TextSplitter to break large document to chunks (easy to index and pass to model)
    - Store: using VectorStore and Embeddings for later search

- Retrieval and generation: actual RAG chain, take user query (RUNTIME) and retrieves the relevant data from index, then pass to model
    - Retrieve: user input => relevant splits retrieved from storage
    - Generate: using ChatModel/LLM (llama2) to provide answer using user questions & retrieved data





