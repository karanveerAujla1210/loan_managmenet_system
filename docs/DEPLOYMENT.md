# Deployment & Environment Guide

## Environments

| Env | Purpose |
|-----|---------|
| development | Local dev |
| staging | QA / UAT |
| production | Live |

## Required ENV Variables (Backend)

```
NODE_ENV=production
PORT=4000

MONGODB_URI=mongodb://user:pass@host/db
JWT_SECRET=super-secure-secret
JWT_EXPIRY=8h

CRON_ENABLED=true

REDIS_URL=redis://host:6379

LOG_LEVEL=info

CORS_ORIGIN=https://yourdomain.com
```

## Docker Production Flow

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Containers:
- api
- mongodb
- redis
- nginx

## Cron Safety Rules

- Cron runs inside backend container
- Disabled via CRON_ENABLED=false
- Logs to cron.log

## Database Safety

- Backups daily
- Reconciled days immutable
- No direct DB edits in production

## Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```
