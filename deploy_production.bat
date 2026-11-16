@echo off
REM ========================================================
REM TRUCK RESCUE INDIA — PRODUCTION DEPLOYMENT SCRIPT
REM Multi-Target: Firebase Hosting & Vercel
REM ========================================================

echo ========================================================
echo   TRUCK RESCUE INDIA -- PRODUCTION DEPLOYMENT
echo ========================================================
echo.

REM Step 1: Environment Check
echo [1/5] Verifying environment configurations...
if not exist ".env.local" (
    echo [ERROR] .env.local file not found!
    echo Please copy .env.example to .env.local and configure your Firebase credentials.
    pause
    exit /b 1
)
echo [OK] .env.local found.

REM Step 2: Clean previous builds
echo.
echo [2/5] Cleaning previous Next.js cache...
if exist ".next" rmdir /s /q ".next"
echo [OK] Cache cleaned.

REM Step 3: Run Full Production Build
echo.
echo [3/5] Compiling Next.js production build...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [FATAL] Next.js build failed. Aborting deployment!
    pause
    exit /b %ERRORLEVEL%
)
echo [OK] Production build successful.

REM Step 4: Run Automated Verification Tests
echo.
echo [4/5] Executing pre-deployment test suite...
call node scripts/test_phase11.js
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Test suite reported warnings or failures.
)

REM Step 5: Choose Deployment Target
echo.
echo [5/5] Ready for Deployment!
echo Select your target:
echo   [1] Deploy to Firebase Hosting (firebase deploy)
echo   [2] Deploy to Vercel (vercel --prod)
echo   [3] Build only (Exit)
echo.

set /p TARGET="Enter choice (1, 2, or 3): "

if "%TARGET%"=="1" (
    echo Deploying to Firebase Hosting...
    firebase deploy --only hosting,firestore:rules,storage:rules
) else if "%TARGET%"=="2" (
    echo Deploying to Vercel Production...
    npx vercel --prod
) else (
    echo Deployment build prepared successfully.
)

echo.
echo ========================================================
echo   DEPLOYMENT PROCESS COMPLETED
echo ========================================================
pause
