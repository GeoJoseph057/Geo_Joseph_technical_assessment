# Backend Setup Instructions

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and add your actual API keys:**
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   HOST=0.0.0.0
   PORT=8000
   DEBUG=true
   ENVIRONMENT=development
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

### Option 1: Using the batch file (Windows)
```bash
start_server.bat
```

### Option 2: Using uvicorn directly
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Option 3: Using python-dotenv (if installed)
```bash
pip install python-dotenv
python main.py
```

## Important Security Notes

- **Never commit `.env.local` to git** - it contains your actual API keys
- The `.env.local` file is already added to `.gitignore` 
- Use `.env.example` as a template for new developers
- Keep your API keys secure and rotate them regularly

## API Keys Required

- **OpenAI API Key**: Get from https://platform.openai.com/api-keys
