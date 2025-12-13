@echo off
echo Starting Loan Management System Development Environment...
echo.

echo [1/3] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo [2/3] Starting Frontend Development Server...
cd frontend-web
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo [3/3] Opening Application in Browser...
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo.
echo ✅ Development environment started successfully!
echo.
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul