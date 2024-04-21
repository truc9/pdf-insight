import chromadb


class VectorStore:

    def __init__(self, path) -> None:
        self.path = path

    def persist_docs(self, docs):
        pass
        # embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        # db = Chroma.from_documents(docs, embedding, persist_directory=self.path)
        # db.persist()
