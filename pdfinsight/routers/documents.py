import os
from fastapi import APIRouter, status, UploadFile
from fastapi.responses import JSONResponse
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.model import SourceDocModel
from core.doc import SourceDoc
from infra.vector_store import VectorStore

router = APIRouter(prefix="/api/v1/documents")

UPLOAD_DIR = os.path.join(os.path.abspath(os.path.curdir), "tmp", "docs")

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/paths", tags=["Documents"])
async def get_docs():
    result = []
    for file_path in os.listdir(UPLOAD_DIR):
        if os.path.isfile(os.path.join(UPLOAD_DIR, file_path)):
            result.append(SourceDoc(file_path, os.path.join(UPLOAD_DIR, file_path)))
    return result


@router.post("/upload", tags=["Documents"])
async def upload(
    files: list[UploadFile],
):
    success_paths = []
    failed_paths = []
    # os.makedirs(UPLOAD_DIR, exist_ok=True)
    # print(f"Ensure upload dir exist: {UPLOAD_DIR}")

    for file in files:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        try:
            file_obj = await file.read()
            with open(file_path, "wb") as fh:
                fh.write(file_obj)
            success_paths.append(file_path)
        except (ValueError, TypeError) as ex:
            failed_paths.append(file_path)
    return JSONResponse(
        content={
            "success": success_paths,
            "failed": failed_paths,
        },
    )


@router.post("/load", tags=["Documents"])
def load_doc(doc: SourceDocModel):
    try:
        loader = PyPDFLoader(doc.path)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=10)
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
