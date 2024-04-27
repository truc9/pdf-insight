from dotenv import dotenv_values
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from routers import chats, docs

env = dotenv_values(".env")

app = FastAPI(title="PDF Insight API", default_response_class=ORJSONResponse)

origins = ["http://localhost:3000", "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=chats.router)
app.include_router(router=docs.router)
