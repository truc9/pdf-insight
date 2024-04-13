from fastapi import FastAPI, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from pdfinsight.extractor import PdfExtractor
from pdfinsight.model import TextModel

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

@app.post("/api/v1/pdfs/upload")
async def upload_pdf(file: UploadFile):
    if not file:
        return {
            "error": "No file uploaded"
        }

    bytes = await file.read()
    size = len(bytes)

    extractor = PdfExtractor(bytes)
    data = extractor.extract()

    return JSONResponse(
        status_code=200,
        content={
            "size": size,
            "data": jsonable_encoder(data)
        }
    )
@app.post('/api/v1/train')
async def train(req: TextModel):
    return JSONResponse(
        status_code=200,
        content=jsonable_encoder(req)
    )