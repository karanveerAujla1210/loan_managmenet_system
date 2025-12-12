@echo off
echo ========================================
echo  NBFC Analytics Dashboard Setup
echo ========================================

echo.
echo Installing backend dependencies...
cd backend
call npm install

echo.
echo Installing frontend dependencies...
cd ..\frontend-web
call npm install recharts lucide-react

echo.
echo Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting frontend server...
cd ..\frontend-web
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Backend running on: http://localhost:5000
echo Frontend running on: http://localhost:5173
echo.
echo Analytics Dashboard Features:
echo - Portfolio Overview with KPIs
echo - Bucket Analysis & DPD Distribution  
echo - Cashflow Forecasting
echo - Agent Performance Tracking
echo - Legal Cases Dashboard
echo - Defaults Analysis
echo - Closed Loans Insights
echo - Roll Rate Analysis
echo - Collection Efficiency Metrics
echo.
echo Navigate to /analytics in the web app to access the dashboard
echo.
pause