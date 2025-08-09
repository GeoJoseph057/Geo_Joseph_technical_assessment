@echo off
REM Load environment variables from .env.local file if it exists
if exist .env.local (
    echo Loading environment variables from .env.local...
    for /f "usebackq tokens=1,2 delims==" %%i in (".env.local") do (
        if not "%%i"=="" if not "%%i"=="REM" if not "%%i"=="#" set %%i=%%j
    )
) else (
    echo .env.local file not found. Please create it using .env.example as template.
    echo Copy .env.example to .env.local and add your actual API key.
    pause
    exit /b 1
)

REM Start the server
python -m uvicorn main:app --reload --host %HOST% --port %PORT%
