REQUIREMENTS := requirements.txt
APP_MODULE := application.pdfinsight:app
PORT := 8080

install:
	@pip3 install -r requirements.txt

dev:
	@python main.py

devu:
	@uvicorn $(APP_MODULE) --host localhost --port 8080 --reload

.PHONY: install dev devu