@echo off
echo Fixing startup issues...

echo Installing frontend dependencies...
cd frontend-web
npm install @heroicons/react
cd ..

echo Starting backend only...
cd backend
npm run dev