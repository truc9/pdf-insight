import os

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
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain import hub
from fastapi.responses import StreamingResponse

from application.models import SourceDocModel, QuestionModel
from infrastructure.utils import Utils

app = FastAPI(title="PDF Insight API", default_response_class=ORJSONResponse)

VECTOR_STORE_PATH = os.path.join(os.curdir, "tmp/vectordb")

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
def load_doc(doc: SourceDocModel):
    try:
        loader = PyPDFLoader(doc.path)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = splitter.split_documents(documents)

        embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

        db = Chroma.from_documents(docs, embedding, persist_directory=VECTOR_STORE_PATH)

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
async def chat(q: QuestionModel):
    question = q.question
    print(f"getting question: {question}")
    generator = answer_generator(question=question)
    return StreamingResponse(generator, media_type="text/event-stream")


async def answer_generator(question: str):
    llm = ChatOllama(model="llama3")
    embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

    vectorstore = Chroma(
        persist_directory=VECTOR_STORE_PATH,
        embedding_function=embedding,
    )
    retriever = vectorstore.as_retriever()

    prompt = hub.pull("rlm/rag-prompt")

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    async for chunk in chain.astream(question):
        print(chunk, end="", flush=True)
        yield chunk or ""
