@echo off
echo Importing sample loan data...

curl -X POST http://localhost:5000/api/v1/loans/import ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d @loan_disbursement_with_payments.json

echo.
echo Import completed! Check the frontend at http://localhost:5173/import
pause