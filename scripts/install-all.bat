@echo off
echo Installing NBFC Loan Management System...
echo.

echo [1/5] Installing root dependencies...
call npm install
echo.

echo [2/5] Installing backend dependencies...
cd backend
call npm install
cd ..
echo.

echo [3/5] Installing frontend dependencies...
cd frontend-web
call npm install
cd ..
echo.

echo [4/5] Installing mobile app dependencies...
cd mobile-app
call npm install
cd ..
echo.

echo [5/5] Installing desktop app dependencies...
cd desktop-app
call npm install
cd renderer
call npm install
cd ../..
echo.

echo Installation completed successfully!
echo.
echo To start the development servers, run:
echo   npm run dev-all
echo.
pause