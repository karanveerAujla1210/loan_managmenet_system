const mongoose = require('mongoose');
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

// Validation function
const validateMigration = async () => {
  try {
    console.log('Starting migration validation...\n');
    
    // Basic counts
    const totalCustomers = await Customer.countDocuments();
    console.log(`📊 Total Customers: ${totalCustomers}`);
    
    // Check for required fields
    const missingFirstName = await Customer.countDocuments({ firstName: { $in: [null, ''] } });
    const missingPhone = await Customer.countDocuments({ phone: { $in: [null, ''] } });
    
    console.log(`❌ Missing First Name: ${missingFirstName}`);
    console.log(`❌ Missing Phone: ${missingPhone}`);
    
    // Check for duplicates
    const duplicatePhones = await Customer.aggregate([
      { $group: { _id: '$phone', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: 'duplicates' }
    ]);
    
    const duplicateCount = duplicatePhones.length > 0 ? duplicatePhones[0].duplicates : 0;
    console.log(`🔄 Duplicate Phone Numbers: ${duplicateCount}`);
    
    // Data quality checks
    const validEmails = await Customer.countDocuments({ 
      email: { $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } 
    });
    const totalWithEmails = await Customer.countDocuments({ 
      email: { $ne: null, $ne: '' } 
    });
    
    console.log(`📧 Valid Email Addresses: ${validEmails}/${totalWithEmails}`);
    
    // Check address completeness
    const completeAddresses = await Customer.countDocuments({
      'address.line1': { $ne: null, $ne: '' },
      'address.city': { $ne: null, $ne: '' },
      'address.state': { $ne: null, $ne: '' },
      'address.pincode': { $ne: null, $ne: '' }
    });
    
    console.log(`🏠 Complete Addresses: ${completeAddresses}/${totalCustomers}`);
    
    // KYC status
    const verifiedKyc = await Customer.countDocuments({ 'kyc.isVerified': true });
    const withAadhaar = await Customer.countDocuments({ 'kyc.aadhaar': { $ne: null } });
    const withPan = await Customer.countDocuments({ 'kyc.pan': { $ne: null } });
    
    console.log(`✅ Verified KYC: ${verifiedKyc}`);
    console.log(`🆔 With Aadhaar: ${withAadhaar}`);
    console.log(`🆔 With PAN: ${withPan}`);
    
    // Active status
    const activeCustomers = await Customer.countDocuments({ isActive: true });
    console.log(`🟢 Active Customers: ${activeCustomers}/${totalCustomers}`);
    
    // Recent data
    const recentCustomers = await Customer.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    console.log(`🆕 Created in Last 24h: ${recentCustomers}`);
    
    // Sample data
    console.log('\n📋 Sample Customer Data:');
    const sampleCustomers = await Customer.find({})
      .select('firstName lastName phone email isActive createdAt')
      .limit(5)
      .lean();
    
    sampleCustomers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.firstName} ${customer.lastName || ''} - ${customer.phone} - Active: ${customer.isActive}`);
    });
    
    // Data integrity issues
    console.log('\n🔍 Data Integrity Issues:');
    
    if (missingFirstName > 0) {
      console.log(`⚠️  ${missingFirstName} customers missing first name`);
    }
    
    if (missingPhone > 0) {
      console.log(`⚠️  ${missingPhone} customers missing phone number`);
    }
    
    if (duplicateCount > 0) {
      console.log(`⚠️  ${duplicateCount} duplicate phone numbers found`);
      
      // Show duplicate phone numbers
      const duplicates = await Customer.aggregate([
        { $group: { _id: '$phone', count: { $sum: 1 }, customers: { $push: { firstName: '$firstName', lastName: '$lastName' } } } },
        { $match: { count: { $gt: 1 } } },
        { $limit: 5 }
      ]);
      
      duplicates.forEach(dup => {
        console.log(`   📞 ${dup._id}: ${dup.customers.map(c => `${c.firstName} ${c.lastName || ''}`).join(', ')}`);
      });
    }
    
    // Summary
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Total customers imported: ${totalCustomers}`);
    console.log(`✅ Data quality score: ${Math.round(((totalCustomers - missingFirstName - missingPhone - duplicateCount) / totalCustomers) * 100)}%`);
    
    if (missingFirstName === 0 && missingPhone === 0 && duplicateCount === 0) {
      console.log('🎉 Migration validation passed! All data looks good.');
    } else {
      console.log('⚠️  Migration validation found some issues. Please review the data.');
    }
    
  } catch (error) {
    console.error('Validation failed:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await validateMigration();
    console.log('\nValidation completed!');
    process.exit(0);
  } catch (error) {
    console.error('Validation failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateMigration, connectDB };