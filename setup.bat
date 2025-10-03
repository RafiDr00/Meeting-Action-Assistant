@echo off
echo ============================================
echo   Meeting Action Assistant - Setup Script
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

echo 🔧 Setting up Frontend...
echo.

REM Install frontend dependencies
npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Create frontend .env file if it doesn't exist
if not exist ".env" (
    echo Creating frontend .env file...
    copy .env.example .env >nul
)

echo ✅ Frontend setup complete!
echo.

echo 🔧 Setting up Backend...
echo.

REM Navigate to backend directory
cd backend

REM Create virtual environment
if not exist "venv\" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install backend dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    cd..
    pause
    exit /b 1
)

REM Create backend .env file if it doesn't exist
if not exist ".env" (
    echo Creating backend .env file...
    copy .env.example .env >nul
    echo.
    echo ⚠️  IMPORTANT: Please edit backend\.env and add your OpenAI API key!
    echo    Get your API key from: https://platform.openai.com/api-keys
    echo.
)

REM Create uploads directory
if not exist "uploads\" mkdir uploads

cd..

echo ✅ Backend setup complete!
echo.
echo ============================================
echo   Setup Complete! 🎉
echo ============================================
echo.
echo Next steps:
echo 1. Add your OpenAI API key to backend\.env
echo 2. Start the backend: cd backend && start.bat
echo 3. Start the frontend: npm run dev
echo 4. Open http://localhost:3000
echo.
echo For detailed instructions, see README.md
echo.
pause