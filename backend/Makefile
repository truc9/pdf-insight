REQUIREMENTS := requirements.txt
APP_MODULE := application.pdfinsight:app
PORT := 8080

install:
	@pip3 install -r requirements.txt

run:
	@python main.py

# Having some issue with uvicorn on Ctrl+C to stop when reload=True
# dev:
# 	@uvicorn $(APP_MODULE) --host localhost --port 8080 --reload

.PHONY: install dev devu
