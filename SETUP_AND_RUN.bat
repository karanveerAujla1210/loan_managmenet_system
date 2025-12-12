@echo off
echo ========================================
echo  NBFC Loan Management System Setup
echo ========================================
echo.

echo 1. Installing dependencies...
echo.

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend-web
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Installing mobile app dependencies...
cd ..\mobile-app
call npm install
if %errorlevel% neq 0 (
    echo Error installing mobile app dependencies
    pause
    exit /b 1
)

echo.
echo Installing desktop app dependencies...
cd ..\desktop-app
call npm install
if %errorlevel% neq 0 (
    echo Error installing desktop app dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo To start the system:
echo 1. Make sure MongoDB is running
echo 2. Run start-all-services.bat
echo.
echo To test API connections:
echo 1. Start backend: cd backend && npm run dev
echo 2. Run: node API_TEST_SCRIPT.js
echo.
pause