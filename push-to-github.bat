@echo off
echo ============================================
echo   🚀 GitHub Push Helper Script
echo ============================================
echo.

echo Current repository status:
git log --oneline -3
echo.

echo 📝 Instructions:
echo 1. Create a new repository on GitHub.com
echo 2. Copy the repository URL (e.g., https://github.com/username/meeting-action-assistant.git)
echo 3. Run the commands below with YOUR repository URL
echo.

set /p repo_url="📋 Enter your GitHub repository URL: "

if "%repo_url%"=="" (
    echo ❌ No URL provided. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🔗 Adding remote origin...
git remote add origin %repo_url%

echo 📤 Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel%==0 (
    echo.
    echo ✅ SUCCESS! Your project is now on GitHub!
    echo 🌐 Repository URL: %repo_url%
    echo.
    echo 🎯 Next steps:
    echo - Add repository description and topics
    echo - Update your portfolio with the GitHub link
    echo - Consider deploying the application for a live demo
    echo.
) else (
    echo.
    echo ❌ Push failed. Please check:
    echo - Repository URL is correct
    echo - You have write access to the repository
    echo - GitHub authentication is set up
    echo.
)

pause