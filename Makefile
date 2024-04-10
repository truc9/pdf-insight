VENV_NAME := .venv
REQUIREMENTS := requirements.txt
APP_MODULE := main:app
PORT := 8000

install:
	pip3 install -r requirements.txt

dev:
	uvicorn $(APP_MODULE) --host 0.0.0.0 --port $(PORT) --reload

# .PHONY: venv activate install dev