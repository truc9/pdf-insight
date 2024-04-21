from pydantic import BaseModel


class QuestionModel(BaseModel):
    question: str


class SourceDocModel(BaseModel):
    name: str
    path: str
