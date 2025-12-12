@echo off
echo Starting NBFC Loan Management System Development Servers...
echo.

echo Starting MongoDB (make sure MongoDB is installed and running)
echo If MongoDB is not running, please start it manually or use Docker:
echo   docker run -d -p 27017:27017 --name mongodb mongo:7.0
echo.

echo [1/3] Seeding database...
cd backend
call npm run seed
echo.

echo [2/3] Starting backend server...
start "Backend Server" cmd /k "npm run dev"
cd ..
echo.

echo [3/3] Starting frontend server...
cd frontend-web
start "Frontend Server" cmd /k "npm run dev"
cd ..
echo.

echo Development servers are starting...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause