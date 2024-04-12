from langchain_community.chat_models import ChatOllama
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def load_custom_source() -> bool:
    global retriever
    loader = PyPDFLoader("SET_M__04-14.pdf")
    pages = loader.load_and_split()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=0,
        add_start_index=True
    )
    all_splits = splitter.split_documents(pages)

    print('Text split completed')

    if len(all_splits) == 0:
        print('No text parsed')
        return False

    print('Text:\n')
    for text in all_splits:
        print(f'{text}\n')

    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    chroma = Chroma.from_documents(documents=all_splits, embedding=embedding)
    retriever = chroma.as_retriever()

    return True

def chat(question: str):
    llm = ChatOllama(model="llama2")

    template = """Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Use three sentences maximum and keep the answer as concise as possible.
    Always say "thanks for asking!" at the end of the answer.
    
    {context}
    
    Question: {question}
    
    Helpful Answer:"""

    prompt = PromptTemplate.from_template(template)

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    for chunk in chain.stream(question):
        print(chunk, end="", flush=True)

    print("\nThanks for using TrucGPT\n")

if __name__ == "__main__":
    print("Welcome to TrucGPT, LLM in your local")
    success = load_custom_source()
    if success:
        while True:
            question = input("Ask me: ")
            if question == "exit":
                break
            chat(question)
