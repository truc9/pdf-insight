import chromadb


class VectorStore:
    def __init__(self):
        self._client = chromadb.PersistentClient(database="pdfi", path="./chroma_db")

    def get_or_create(self, name: str):
        return self._client.get_or_create_collection(name)
