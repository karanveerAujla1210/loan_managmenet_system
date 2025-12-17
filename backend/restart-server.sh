#!/bin/bash

echo "🔄 Restarting Loan CRM API..."

# Kill existing PM2 process
pm2 delete loan-crm-api 2>/dev/null || true

# Wait a moment
sleep 2

# Start new process
pm2 start src/server.js --name loan-crm-api

# Show status
pm2 status

# Show logs
echo ""
echo "📋 Recent logs:"
pm2 logs loan-crm-api --lines 20
