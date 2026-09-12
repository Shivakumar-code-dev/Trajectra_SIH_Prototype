@echo off
REM ======================================================
REM YIT Indoor Navigation — Backend Startup Script (Windows)
REM ======================================================

cd /d "%~dp0admin-web\backend"

IF NOT EXIST ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt --quiet

echo.
echo =============================================
echo  YIT IndoorNav Flask Backend Starting...
echo  URL: http://localhost:5000
echo  API: http://localhost:5000/api
echo =============================================
echo.

python app.py
