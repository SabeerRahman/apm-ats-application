@echo off
echo Starting ATS Resume Parser Backend...
cd /d "%~dp0"

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
pip install -r requirements.txt --quiet

echo.
echo Backend running at http://localhost:8000
echo Docs available at http://localhost:8000/docs
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
