<div align="center">
  <img src="./doc/logo.jpeg" height="400">
  <h1>PDF Insight</h1>
</div>

Experiment project with LLM RAG using llama3 and langchain

<sub>⚠️ This project not supported upload file from UI yet, in order to load PDF, place PDF documents into directory `rag/tmp/docs` and load from UI</sub>

## What is RAG?
- Retrieval-Augmented Generation (RAG)
- Enhance the accuracy and reliability of GenAI models with data from external sources

## Why RAG ?
- LLM (ChatGPT, Gemini...) does not know your data
- LLM might not know or give out-of-date answer about knowledege beyond the cut-off point
- LLM does not know about specific knowledge (eg: your company data for customer support, your bespoke software user manual...)
- RAG solves above problems

## How RAG works ?
- //TODO

## Roadmap
- [x] Load PDFs from directory
- [x] Q&A with context from loaded PDFs
- [x] Stream text to UI
- [ ] Add message history (memory)
- [ ] Format chat response
- [ ] Upload PDF from UI
- [ ] Measure performance & reliability
- [ ] Support images, tables in PDF

## Screenshots

![alt text](./doc/sc1.png "Title")

![alt text](./doc/sc2.png "Title")

## Reference
- https://ollama.com/library/llama3
- https://python.langchain.com/docs/use_cases/question_answering
- https://www.databricks.com/glossary/retrieval-augmented-generation-rag

<sub>Logo generated with Dream Studio (https://beta.dreamstudio.ai/)</sub>
