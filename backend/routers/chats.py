from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain_community.chat_models.ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough

from application.model import QuestionModel
from infrastructure.vector_store import VectorStore

router = APIRouter(prefix="/api/v1")


@router.post("/chat", tags=["Chats"])
async def chat(q: QuestionModel):
    question = q.question
    generator = answer(question=question)
    return StreamingResponse(generator, media_type="text/event-stream")


async def answer(question: str):
    llm = ChatOllama(model="llama3.1")
    vectorstore = VectorStore()
    retriever = vectorstore.get_db().as_retriever()

    template = """Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Use three sentences maximum and keep the answer as concise as possible.
    Always say "thanks for asking!" at the end of the answer.

    {context}

    Question: {question}

    Helpful Answer:"""
    prompt = PromptTemplate.from_template(template)

    def format(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    chain = (
            {"context": retriever | format, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
    )

    async for chunk in chain.astream(question):
        print(chunk, end="", flush=True)
        yield chunk or ""
