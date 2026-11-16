@echo off
REM ========================================================
REM TRUCK RESCUE INDIA — ANDROID APP BUILD SCRIPT
REM Builds Debug APK, Release APK and Production AAB
REM ========================================================

echo ========================================================
echo   TRUCK RESCUE INDIA -- ANDROID BUILD UTILITY
echo   Package: com.truckrescue.india
echo ========================================================
echo.

cd flutter_app

REM Check for Flutter SDK in PATH
where flutter >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Flutter SDK is not installed in system PATH!
    echo Please install Flutter 3.x from https://docs.flutter.dev/get-started/install
    echo and ensure flutter/bin is added to your Environment PATH.
    pause
    exit /b 1
)

echo [1/4] Running flutter pub get...
call flutter pub get
if %ERRORLEVEL% neq 0 (
    echo [ERROR] pub get failed. Check pubspec.yaml dependencies.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Select Build Type:
echo   [1] Debug APK (fast build for testing on physical phone)
echo   [2] Release APK (optimized standalone APK for manual installation)
echo   [3] Release App Bundle (.aab for Google Play Store upload)
echo.
set /p CHOICE="Enter choice (1, 2, or 3): "

if "%CHOICE%"=="1" (
    echo [2/4] Building Debug APK...
    call flutter build apk --debug
    echo.
    echo [SUCCESS] Debug APK built at:
    echo flutter_app\build\app\outputs\flutter-apk\app-debug.apk
) else if "%CHOICE%"=="2" (
    echo [2/4] Building Release APK...
    call flutter build apk --release
    echo.
    echo [SUCCESS] Release APK built at:
    echo flutter_app\build\app\outputs\flutter-apk\app-release.apk
) else if "%CHOICE%"=="3" (
    echo [2/4] Building Production Google Play App Bundle (AAB)...
    call flutter build appbundle --release
    echo.
    echo [SUCCESS] Release AAB built at:
    echo flutter_app\build\app\outputs\bundle\release\app-release.aab
) else (
    echo Invalid choice. Exiting.
)

echo.
echo ========================================================
echo   BUILD PROCESS COMPLETE
echo ========================================================
pause
