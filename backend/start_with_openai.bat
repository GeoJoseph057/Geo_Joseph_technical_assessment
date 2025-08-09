@echo off
set OPENAI_API_KEY=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
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
