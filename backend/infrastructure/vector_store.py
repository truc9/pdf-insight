import os

from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

VECTOR_STORE_PATH = os.path.join("tmp", "vectordb")

class VectorStore:
    _embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

    def __init__(self) -> None:
        self._path = VECTOR_STORE_PATH

    def load_docs(self, docs: list[Document]):
        db = Chroma.from_documents(docs, self._embedding, persist_directory=self._path)
        db.persist()

    def get_db(self):
        db = Chroma(
            persist_directory=self._path,
            embedding_function=self._embedding,
        )
        return db
