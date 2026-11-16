@echo off
title TRUCK RESCUE INDIA - Vercel Live Deployment
color 0A

echo ========================================================
echo   TRUCK RESCUE INDIA - VERCEL CLOUD DEPLOYMENT
echo ========================================================
echo.
echo Step 1: Checking Vercel CLI...
cd /d "C:\Users\sapat\.gemini\antigravity\scratch\truck-rescue-india"

call vercel.cmd --version
if %errorlevel% neq 0 (
    echo Vercel CLI not found, installing now...
    call npm install -g vercel
)

echo.
echo ========================================================
echo Step 2: Logging in to Vercel...
echo ========================================================
echo Please select your login method in the terminal or browser.
echo.
call vercel.cmd login

echo.
echo ========================================================
echo Step 3: Deploying Website to Production...
echo ========================================================
echo.
call vercel.cmd --prod

echo.
echo ========================================================
echo Deployment Complete!
echo Press any key to exit...
echo ========================================================
pause > nul
