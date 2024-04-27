from pydantic import BaseModel
from pydantic import BaseModel, Field


class QuestionModel(BaseModel):
    question: str


class SourceDocModel(BaseModel):
    name: str
    path: str
