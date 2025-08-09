@echo off
REM Run this script to start the FastAPI backend server
REM Make sure you have installed the dependencies: pip install -r requirements.txt

uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
