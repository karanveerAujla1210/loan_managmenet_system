@echo off
echo Setting up DPD Cron Job for Loan Management System
echo.

REM Create a scheduled task to run DPD update daily at 2 AM
schtasks /create /tn "LoanManagement-DPD-Update" /tr "cd /d \"c:\server\Business Loan Crm\loan-management-system\backend\" && npm run update-dpd" /sc daily /st 02:00 /f

echo.
echo Cron job created successfully!
echo Task Name: LoanManagement-DPD-Update
echo Schedule: Daily at 2:00 AM
echo.
echo To view the task: schtasks /query /tn "LoanManagement-DPD-Update"
echo To delete the task: schtasks /delete /tn "LoanManagement-DPD-Update" /f
pause