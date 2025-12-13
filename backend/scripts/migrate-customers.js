const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import Customer model
const Customer = require('../src/models/customer.model');

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/loan_management';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Helper function to convert UUID to ObjectId
const uuidToObjectId = (uuid) => {
  if (!uuid) return null;
  // Create a consistent ObjectId from UUID using first 24 chars of hash
  const hash = require('crypto').createHash('md5').update(uuid).digest('hex');
  return new mongoose.Types.ObjectId(hash.substring(0, 24));
};

// Clean and validate customer data
const cleanCustomerData = (customer) => {
  return {
    _id: uuidToObjectId(customer._id),
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    phone: customer.phone || '',
    email: customer.email || null,
    dob: customer.dob ? new Date(customer.dob) : null,
    address: {
      line1: customer.address?.line1 || '',
      city: customer.address?.city || '',
      state: customer.address?.state || '',
      pincode: customer.address?.pincode || ''
    },
    kyc: {
      aadhaar: customer.kyc?.aadhaar || null,
      pan: customer.kyc?.pan || null,
      documents: customer.kyc?.documents || [],
      isVerified: customer.kyc?.isVerified || false
    },
    creditScore: customer.creditScore || null,
    monthlyIncome: customer.monthlyIncome || null,
    employmentType: customer.employmentType || null,
    isActive: customer.isActive !== undefined ? customer.isActive : true,
    createdBy: customer.createdBy ? uuidToObjectId(customer.createdBy) : null,
    metadata: customer.metadata || {},
    createdAt: customer.createdAt ? new Date(customer.createdAt) : new Date(),
    updatedAt: customer.updatedAt ? new Date(customer.updatedAt) : new Date()
  };
};

// Migration function
const migrateCustomers = async () => {
  try {
    console.log('Starting customer data migration...');
    
    // Read the JSON file
    const dataPath = path.join(__dirname, '../../mongo_6_tables_filled.json');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found at: ${dataPath}`);
    }
    
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log('Data loaded successfully');
    
    if (!data.customers || !Array.isArray(data.customers)) {
      throw new Error('No customers data found in the JSON file');
    }
    
    console.log(`Found ${data.customers.length} customers to migrate`);
    
    // Ask user if they want to clear existing data
    const existingCount = await Customer.countDocuments();
    if (existingCount > 0) {
      console.log(`Warning: ${existingCount} customers already exist in the database`);
      console.log('Proceeding with migration (duplicates will be skipped)...');
    }
    
    // Process customers in batches
    const batchSize = 100;
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (let i = 0; i < data.customers.length; i += batchSize) {
      const batch = data.customers.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(data.customers.length / batchSize)}...`);
      
      for (const customerData of batch) {
        try {
          const cleanedData = cleanCustomerData(customerData);
          
          // Check if customer already exists
          const existingCustomer = await Customer.findOne({
            $or: [
              { _id: cleanedData._id },
              { phone: cleanedData.phone }
            ]
          });
          
          if (existingCustomer) {
            console.log(`Skipping duplicate customer: ${cleanedData.firstName} ${cleanedData.lastName} (${cleanedData.phone})`);
            continue;
          }
          
          // Create new customer
          const customer = new Customer(cleanedData);
          await customer.save();
          successCount++;
          
        } catch (error) {
          errorCount++;
          const errorMsg = `Failed to migrate customer ${customerData.firstName} ${customerData.lastName}: ${error.message}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }
    }
    
    console.log('\n=== Migration Summary ===');
    console.log(`Total customers processed: ${data.customers.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Final customer count: ${await Customer.countDocuments()}`);
    
    if (errors.length > 0) {
      console.log('\nErrors encountered:');
      errors.forEach(error => console.log(`- ${error}`));
    }
    
    console.log('========================\n');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await migrateCustomers();
    console.log('Customer migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Customer migration failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { migrateCustomers, connectDB };