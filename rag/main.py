from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import ORJSONResponse
from langchain_community.chat_models.ollama import ChatOllama
from langchain_community.document_loaders.pdf import PyPDFLoader
from langchain_community.embeddings.sentence_transformer import (
    SentenceTransformerEmbeddings,
)
from langchain_community.vectorstores.chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter

from application.models import QuestionModel, SourceDocModel
from infrastructure.utils import Utils

prompt = ChatPromptTemplate.from_template(
    """
    Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Use three sentences maximum and keep the answer as concise as possible.
    Always say "thanks for asking!" at the end of the answer.
    
    {context}
    Question: {question}
    Answer: 
"""
)

app = FastAPI(title="PDF Insight API", default_response_class=ORJSONResponse)

origins = ["http://localhost:3000", "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/documents/paths")
async def get_doc_paths():
    docs = Utils.get_docs()
    return docs


@app.post("/api/v1/documents/load")
async def load_doc(doc: SourceDocModel):
    try:
        loader = PyPDFLoader(doc.path)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = splitter.split_documents(documents)

        embedding_function = SentenceTransformerEmbeddings(
            model_name="all-MiniLM-L6-v2"
        )

        db = Chroma.from_documents(
            docs, embedding_function, persist_directory="./chroma_db"
        )

        db.persist()

        return JSONResponse(
            status_code=status.HTTP_200_OK, content="Load doc successfully"
        )

    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content="Unable to load PDF to vectorstore",
        )


@app.post("/api/v1/chat")
async def chat(model: QuestionModel):
    llm = ChatOllama(model="llama2")

    return {"question": model.question}
