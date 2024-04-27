from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from application.model import SourceDocModel
from infrastructure.utils import Utils
from infrastructure.vector_store import VectorStore

router = APIRouter(prefix="/api/v1")


@router.get(path="/documents/paths", tags=["documents"])
async def get_docs():
    return Utils.get_docs()


@router.post(path="/documents/load", tags=["documents"])
def load_doc(doc: SourceDocModel):
    try:
        loader = PyPDFLoader(doc.path)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = splitter.split_documents(documents)
        vectorstore = VectorStore()
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
