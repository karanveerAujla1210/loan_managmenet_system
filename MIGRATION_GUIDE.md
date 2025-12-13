# MongoDB Data Migration Guide

This guide explains how to import the customer data from `mongo_6_tables_filled.json` into your MongoDB database.

## Prerequisites

1. MongoDB server running locally or connection string to remote MongoDB
2. Node.js and npm installed
3. Backend dependencies installed (`npm install` in the backend directory)

## Migration Scripts

### 1. Customer Migration (Recommended)
For importing only customer data from the JSON file:

```bash
cd backend
npm run migrate-customers
```

### 2. Full Data Migration
For importing all types of data (users, customers, loans, payments, disbursements, documents):

```bash
cd backend
npm run migrate-data
```

## Environment Setup

Make sure your `.env` file in the backend directory contains the correct MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/loan_management
```

Or for MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/loan_management
```

## Migration Process

### Customer Migration Details

The customer migration script (`migrate-customers.js`) will:

1. **Connect to MongoDB** using the connection string from environment variables
2. **Read the JSON file** (`mongo_6_tables_filled.json`) from the project root
3. **Convert UUIDs to ObjectIds** for MongoDB compatibility
4. **Validate and clean data** to match the Customer schema
5. **Check for duplicates** based on phone number and ID
6. **Insert customers in batches** of 100 for better performance
7. **Provide detailed logging** of the migration process

### Data Transformations

The script performs the following transformations:

- **UUID to ObjectId**: Converts string UUIDs to MongoDB ObjectIds
- **Date Conversion**: Converts date strings to JavaScript Date objects
- **Default Values**: Provides default values for required fields that are null/empty
- **Schema Compliance**: Ensures all data matches the Mongoose schema requirements

### Error Handling

- **Duplicate Detection**: Skips customers that already exist (by ID or phone)
- **Validation Errors**: Logs validation errors and continues with other records
- **Batch Processing**: Processes data in batches to handle large datasets
- **Detailed Reporting**: Provides summary of successful imports and errors

## Post-Migration Verification

After running the migration, verify the data:

```bash
# Connect to MongoDB shell
mongosh

# Switch to your database
use loan_management

# Check customer count
db.customers.countDocuments()

# View sample customers
db.customers.find().limit(5).pretty()

# Check for required fields
db.customers.find({
  $or: [
    { firstName: { $exists: false } },
    { phone: { $exists: false } }
  ]
})
```

## Troubleshooting

### Common Issues

1. **Connection Error**
   - Verify MongoDB is running
   - Check connection string in `.env` file
   - Ensure network connectivity for remote databases

2. **File Not Found**
   - Ensure `mongo_6_tables_filled.json` is in the project root
   - Check file permissions

3. **Validation Errors**
   - Review the error logs for specific validation issues
   - Check that required fields have valid data

4. **Duplicate Key Errors**
   - The script handles duplicates automatically
   - If you see errors, check for data inconsistencies

### Manual Cleanup (if needed)

To clear all customer data and start fresh:

```bash
mongosh
use loan_management
db.customers.deleteMany({})
```

## Data Schema Reference

### Customer Schema
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String,
  phone: String (required, unique),
  email: String,
  dob: Date,
  address: {
    line1: String,
    city: String,
    state: String,
    pincode: String
  },
  kyc: {
    aadhaar: String,
    pan: String,
    documents: [ObjectId],
    isVerified: Boolean
  },
  creditScore: Number,
  monthlyIncome: Number,
  employmentType: String,
  isActive: Boolean,
  createdBy: ObjectId,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Performance Notes

- The migration processes data in batches of 100 records
- Large datasets (10,000+ records) may take several minutes
- Monitor MongoDB memory usage during migration
- Consider running during off-peak hours for production systems

## Security Considerations

- Ensure sensitive data is properly handled
- Use secure connection strings (avoid plain text passwords)
- Backup existing data before migration
- Validate data integrity after migration

## Support

If you encounter issues during migration:

1. Check the console output for detailed error messages
2. Verify your MongoDB connection and permissions
3. Ensure the JSON file format matches the expected structure
4. Review the migration logs for specific error details