@echo off
echo ========================================
echo  Starting NBFC Loan Management System
echo ========================================
echo.

echo Checking if MongoDB is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB is running
) else (
    echo ❌ MongoDB is not running
    echo Please start MongoDB first:
    echo   - Start MongoDB service, or
    echo   - Run: mongod --dbpath "C:\data\db"
    echo.
    pause
    exit /b 1
)

echo.
echo Starting services...
echo.

echo 🚀 Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo 🌐 Starting Frontend Web App...
start "Frontend Web" cmd /k "cd frontend-web && npm run dev"

echo 📱 Starting Mobile App (Expo)...
start "Mobile App" cmd /k "cd mobile-app && npm start"

echo.
echo ========================================
echo  All Services Started!
echo ========================================
echo.
echo 🔗 Access URLs:
echo   Backend API: http://localhost:5000
echo   Frontend Web: http://localhost:5173
echo   Mobile App: Check Expo CLI output
echo.
echo 📊 Health Check: http://localhost:5000/health
echo 📈 API Docs: http://localhost:5000/api/v1
echo.
echo Press any key to run API connection tests...
pause >nul

echo.
echo 🧪 Running API Connection Tests...
node API_TEST_SCRIPT.js

echo.
echo ========================================
echo  System is ready!
echo ========================================
echo.
echo To stop services, close the opened command windows.
echo.
pause