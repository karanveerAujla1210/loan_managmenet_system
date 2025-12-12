@echo off
echo Starting NBFC Loan Management System...

echo.
echo Installing dependencies...
call npm run install-all

echo.
echo Starting all services...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

start "Frontend" cmd /k "cd frontend-web && npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo All services started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul