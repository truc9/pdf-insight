from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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


@app.post("/api/v1/pdfs/extract")
async def extract_pdf(file: UploadFile):
    if not file:
        return {
            "error": "No file uploaded"
        }

    bytes = await file.read()
    size = len(bytes)

    return JSONResponse({
        "size": size,
        "error": ""
    }, 200)
