# Production Data Setup Guide

This guide explains how to insert the production loan and payment data from `final_loancrm_dataset.json` into your MongoDB database.

## Prerequisites

1. **MongoDB Running**: Ensure MongoDB is running on your system
2. **Environment Setup**: Make sure your `.env` file is configured with the correct database connection
3. **Dependencies Installed**: Run `npm install` to install all required packages

## Environment Configuration

Create or update your `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nbfc_loan_management
JWT_SECRET=your_production_jwt_secret_key_here
NODE_ENV=production
```

**Important**: Change the `JWT_SECRET` to a secure random string for production use.

## Data Insertion Process

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Run Production Data Insertion
```bash
npm run insert-production-data
```

This script will:
- Connect to your MongoDB database
- Read data from `final_loancrm_dataset.json`
- Create customers for each loan
- Insert loans with proper EMI calculations
- Insert payment records
- Skip duplicate entries if they already exist

### Step 3: Verify Data Insertion

The script will output:
- Number of customers created
- Number of loans inserted
- Number of payments inserted
- Any errors encountered

## Data Structure

### Loans
- **Customer Creation**: Each loan creates a corresponding customer record
- **EMI Calculation**: Automatic calculation of EMI based on 24% annual interest rate and 12-month tenure
- **Installment Schedule**: Generates monthly installment schedule
- **Status Mapping**: Maps loan status from JSON to database format

### Payments
- **Loan Linking**: Each payment is linked to its corresponding loan
- **Payment Method Mapping**: UPI payments mapped to 'online', others to 'cash'
- **Reference Numbers**: Stored for tracking purposes

## Database Collections

After successful insertion, you'll have data in:
- `customers` - Customer information
- `loans` - Loan details with installment schedules
- `payments` - Payment records linked to loans

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify database permissions

2. **Duplicate Data**
   - Script automatically skips existing records
   - Check console output for skipped entries

3. **Missing JSON File**
   - Ensure `final_loancrm_dataset.json` exists in project root
   - Check file path in script

### Manual Verification

Connect to MongoDB and verify data:
```bash
mongo nbfc_loan_management
db.customers.count()
db.loans.count()
db.payments.count()
```

## Production Considerations

1. **Backup**: Always backup your database before running data insertion
2. **Environment**: Ensure you're running in the correct environment
3. **Monitoring**: Monitor the insertion process for any errors
4. **Validation**: Verify data integrity after insertion

## Security Notes

- Never commit `.env` files with production credentials
- Use strong JWT secrets in production
- Ensure database access is properly secured
- Consider using environment-specific configurations

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your environment configuration
3. Ensure all dependencies are installed
4. Check MongoDB connection and permissions