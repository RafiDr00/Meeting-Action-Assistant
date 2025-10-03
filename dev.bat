@echo off
echo ============================================
echo   Meeting Action Assistant - Development
echo ============================================
echo.

REM Check if .env files exist
if not exist ".env" (
    echo ERROR: Frontend .env file not found
    echo Please run setup.bat first
    pause
    exit /b 1
)

if not exist "backend\.env" (
    echo ERROR: Backend .env file not found
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Starting backend server...
start "Backend Server" cmd /c "cd backend && start.bat"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend development server...
start "Frontend Server" cmd /c "npm run dev && pause"

echo.
echo ============================================
echo   Development servers starting...
echo ============================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Close this window to stop monitoring.
echo Press any key to open the application...
pause >nul

REM Open the application in default browser
start http://localhost:3000

echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
pause