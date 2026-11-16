@echo off
echo ========================================================
echo   TRUCK RESCUE INDIA - Firebase Deployment Assistant
echo ========================================================
cd /d "%~dp0"

echo 1. Checking Firebase Tools...
call npx --yes firebase-tools --version
if errorlevel 1 (
    echo Error: Failed to run firebase tools. Please check internet connection.
    pause
    exit /b 1
)

echo 2. Deploying Firestore Rules, Storage Rules, and Hosting...
call npx firebase-tools deploy --only firestore:rules,storage:rules,hosting

echo Deployment complete!
pause
