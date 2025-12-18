#!/bin/bash

echo "=== Health Check ==="

echo -n "Backend: "
curl -sf http://localhost:5000/health > /dev/null && echo "✓" || echo "✗"

echo -n "Frontend: "
curl -sf http://localhost/ > /dev/null && echo "✓" || echo "✗"

echo -n "MongoDB: "
mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1 && echo "✓" || echo "✗"

echo -n "Redis: "
redis-cli ping > /dev/null 2>&1 && echo "✓" || echo "✗"

echo -n "PM2: "
pm2 status | grep -q "online" && echo "✓" || echo "✗"

echo ""
echo "=== Resources ==="
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')"
echo "Memory: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100)}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $5}')"
