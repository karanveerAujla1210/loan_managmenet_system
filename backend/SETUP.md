# Complete Setup Instructions

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v4.4 or higher)
3. **npm** or **yarn**

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Update `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/loan_management
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 4. Seed Database
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

## Verification

1. **Health Check**: Visit `http://localhost:5000/api/v1/health`
2. **Test Login**: 
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"admin@loanms.com","password":"admin123"}'
   ```

## Production Deployment

### 1. Environment Variables
```env
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your_production_jwt_secret
PORT=5000
NODE_ENV=production
```

### 2. Start Production Server
```bash
npm start
```

### 3. Process Manager (PM2)
```bash
npm install -g pm2
pm2 start src/server.js --name "loan-management-api"
pm2 startup
pm2 save
```

## Database Indexes

The application automatically creates these indexes:
- Customer: email, phone, kyc.status
- Loan: loanId, customerId, status, schedule.dueDate, dpd

## API Testing

Use the provided examples in `EXAMPLES.md` or import the Postman collection:

### Sample API Calls

1. **Create Customer**:
```bash
curl -X POST http://localhost:5000/api/v1/customers \
-H "Content-Type: application/json" \
-d '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "9876543210"
}'
```

2. **Create Loan**:
```bash
curl -X POST http://localhost:5000/api/v1/loans \
-H "Content-Type: application/json" \
-d '{
  "customerId": "CUSTOMER_ID_HERE",
  "principalAmount": 100000,
  "interestRate": 24,
  "startDate": "2024-01-15"
}'
```

3. **Add Payment**:
```bash
curl -X POST http://localhost:5000/api/v1/payments/LOAN_ID_HERE \
-H "Content-Type: application/json" \
-d '{
  "amount": 15000,
  "paymentMethod": "cash"
}'
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env
   - Verify network connectivity

2. **Port Already in Use**:
   ```bash
   # Find process using port 5000
   lsof -i :5000
   # Kill the process
   kill -9 PID
   ```

3. **Validation Errors**:
   - Check request body format
   - Ensure required fields are provided
   - Verify data types match schema

4. **KYC Not Verified Error**:
   - Update customer KYC status to 'verified'
   - Use the seed data which has verified customers

### Logs

Development logs are displayed in console. For production:
```bash
pm2 logs loan-management-api
```

## Performance Optimization

1. **Database Indexes**: Already configured
2. **Connection Pooling**: MongoDB driver handles this
3. **Request Limits**: Configured for 10MB payload
4. **CORS**: Enabled for all origins (configure for production)

## Security Considerations

1. **JWT Secret**: Use strong, unique secret in production
2. **CORS**: Configure specific origins for production
3. **Rate Limiting**: Consider adding rate limiting middleware
4. **Input Validation**: All inputs are validated using Joi
5. **Password Hashing**: Uses bcryptjs with salt rounds

## Monitoring

### Health Endpoints
- `/api/v1/health` - Basic health check
- Monitor MongoDB connection status
- Track API response times

### Key Metrics to Monitor
- Loan creation rate
- Payment processing volume
- Overdue loan percentage
- API response times
- Database query performance

## Backup Strategy

### Database Backup
```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/loan_management" --out=./backup

# Restore backup
mongorestore --uri="mongodb://localhost:27017/loan_management" ./backup/loan_management
```

### Automated Backups
Set up cron jobs for regular backups:
```bash
# Daily backup at 2 AM
0 2 * * * /usr/bin/mongodump --uri="mongodb://localhost:27017/loan_management" --out=/backups/$(date +\%Y\%m\%d)
```

## Scaling Considerations

1. **Database Sharding**: For large datasets
2. **Read Replicas**: For read-heavy workloads
3. **Load Balancing**: Multiple API instances
4. **Caching**: Redis for frequently accessed data
5. **Queue System**: For background processing

## Support

For issues or questions:
1. Check logs for error details
2. Verify environment configuration
3. Test with provided examples
4. Check MongoDB connection and data