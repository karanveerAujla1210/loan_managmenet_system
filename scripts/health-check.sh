#!/bin/bash

echo "=== Loan CRM Health Check ==="
echo ""

# Backend
echo -n "Backend API: "
if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

# Frontend
echo -n "Frontend: "
if curl -sf http://localhost/ > /dev/null 2>&1; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

# MongoDB
echo -n "MongoDB: "
if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

# Redis
echo -n "Redis: "
if redis-cli ping > /dev/null 2>&1; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

# PM2
echo -n "PM2 Processes: "
if pm2 status | grep -q "online"; then
  echo "✓ Running"
else
  echo "✗ Down"
fi

echo ""
echo "=== System Resources ==="
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' 2>/dev/null || echo 'N/A')"
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.2f%%", $3/$2 * 100.0)}' 2>/dev/null || echo 'N/A')"
echo "Disk Usage: $(df -h / | tail -1 | awk '{print $5}' 2>/dev/null || echo 'N/A')"
