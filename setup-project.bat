@echo off
echo ========================================
echo NBFC Loan Management System Setup
echo ========================================

echo.
echo Step 1: Installing root dependencies...
call npm install

echo.
echo Step 2: Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo Step 3: Installing frontend dependencies...
cd frontend-web
call npm install
cd ..

echo.
echo Step 4: Installing mobile app dependencies...
cd mobile-app
call npm install
cd ..

echo.
echo Step 5: Installing desktop app dependencies...
cd desktop-app
call npm install
cd ..

echo.
echo Step 6: Setting up database...
cd backend
call npm run seed
cd ..

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the development servers:
echo   npm run dev-all
echo.
echo Default login credentials:
echo   Admin: admin@nbfc.com / admin123
echo   Manager: manager@nbfc.com / manager123
echo   Agent: agent1@nbfc.com / agent123
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
pause