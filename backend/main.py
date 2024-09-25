import uvicorn

if __name__ == "__main__":
    uvicorn.run("application.pdfinsight:app", host="localhost", port=8080)
