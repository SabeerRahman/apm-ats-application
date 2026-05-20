@echo off
echo Starting ATS Resume Parser Frontend...
cd /d "%~dp0"

if not exist node_modules (
    echo Installing dependencies...
    npm install
)

echo.
echo Frontend running at http://localhost:5173
echo.
npm run dev
