import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from langchain_community.chat_models.ollama import ChatOllama
from langchain_community.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain_community.vectorstores.chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders.pdf import PyPDFLoader

vectorDb = None

llm = ChatOllama(model="llama2")

prompt = ChatPromptTemplate.from_template("""
    Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Use three sentences maximum and keep the answer as concise as possible.
    Always say "thanks for asking!" at the end of the answer.
    
    {context}
    Question: {question}
    Answer: 
""")

app = FastAPI(
    title="PDF Insight API"
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/api/v1/documents/paths")
async def get_doc_paths():
    base_dir = './docs'
    res = []
    for file_path in os.listdir(base_dir):
        if os.path.isfile(os.path.join(base_dir, file_path)):
            res.append(os.path.join(base_dir, file_path))
    return JSONResponse(
        status_code=200,
        content=res
    )


@app.get("/api/v1/documents/load")
async def load_doc(doc: str):
    try:
        loader = PyPDFLoader(doc)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=0
        )
        docs = splitter.split_documents(documents)

        embedding_function = SentenceTransformerEmbeddings(
            model_name="all-MiniLM-L6-v2")

        db = Chroma.from_documents(
            docs, embedding_function, persist_directory="./chroma_db")

        db.persist()

        return JSONResponse(status_code=200, content="Load doc successfully")
    except Exception as error:
        print(error)
        return JSONResponse(status_code=500, content="Unable to load PDF to vectorstore")
