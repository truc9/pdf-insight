import os

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import ORJSONResponse
from fastapi.responses import StreamingResponse
from langchain import hub
from langchain_community.chat_models.ollama import ChatOllama
from langchain_community.document_loaders.pdf import PyPDFLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters import RecursiveCharacterTextSplitter

from application.models import SourceDocModel, QuestionModel
from infrastructure.utils import Utils
from infrastructure.vector_store import VectorStore

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
        vectorstore = VectorStore(VECTOR_STORE_PATH)
        vectorstore.load_docs(docs)

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
    generator = answer(question=question)
    return StreamingResponse(generator, media_type="text/event-stream")


async def answer(question: str):
    llm = ChatOllama(model="llama3")
    vectorstore = VectorStore(VECTOR_STORE_PATH)
    retriever = vectorstore.get_db().as_retriever()

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
