const mongoose = require('mongoose');
require('colors');
require('dotenv').config();

// Import models
const User = require('./src/models/user.model');
const Customer = require('./src/models/customer.model');
const Loan = require('./src/models/loan.model');
const Payment = require('./src/models/payment.model');
const Document = require('./src/models/document.model');
const Disbursement = require('./src/models/disbursement.model');

const verifyDatabaseData = async () => {
  try {
    console.log('🔍 Starting MongoDB Data Verification...'.cyan.bold);
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB'.green);

    // 1. Count entries in each collection
    console.log('\n📊 COLLECTION COUNTS'.yellow.bold);
    const counts = {
      users: await User.countDocuments(),
      customers: await Customer.countDocuments(),
      loans: await Loan.countDocuments(),
      payments: await Payment.countDocuments(),
      documents: await Document.countDocuments(),
      disbursements: await Disbursement.countDocuments()
    };

    Object.entries(counts).forEach(([collection, count]) => {
      console.log(`${collection.padEnd(15)}: ${count}`.white);
    });

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    console.log(`${'Total'.padEnd(15)}: ${total}`.green.bold);

    // 2. Check data integrity for customers
    console.log('\n🔍 CUSTOMER DATA INTEGRITY'.yellow.bold);
    
    // Check for customers with missing required fields
    const customersWithMissingData = await Customer.find({
      $or: [
        { firstName: { $exists: false } },
        { phone: { $exists: false } },
        { dob: null },
        { 'address.line1': null },
        { 'address.city': null },
        { 'address.state': null },
        { 'address.pincode': null }
      ]
    });

    console.log(`Customers with missing required data: ${customersWithMissingData.length}`.red);
    
    if (customersWithMissingData.length > 0) {
      console.log('Issues found:'.red);
      customersWithMissingData.slice(0, 5).forEach(customer => {
        const issues = [];
        if (!customer.firstName) issues.push('firstName missing');
        if (!customer.phone) issues.push('phone missing');
        if (!customer.dob) issues.push('dob null');
        if (!customer.address?.line1) issues.push('address.line1 null');
        if (!customer.address?.city) issues.push('address.city null');
        if (!customer.address?.state) issues.push('address.state null');
        if (!customer.address?.pincode) issues.push('address.pincode null');
        
        console.log(`  - ${customer.firstName || 'Unknown'} (${customer.phone || 'No phone'}): ${issues.join(', ')}`.red);
      });
      if (customersWithMissingData.length > 5) {
        console.log(`  ... and ${customersWithMissingData.length - 5} more`.red);
      }
    }

    // Check for duplicate phone numbers
    const duplicatePhones = await Customer.aggregate([
      { $group: { _id: '$phone', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    console.log(`Duplicate phone numbers: ${duplicatePhones.length}`.yellow);

    // 3. Sample data verification
    console.log('\n📋 SAMPLE DATA VERIFICATION'.yellow.bold);
    
    // Get sample customers
    const sampleCustomers = await Customer.find().limit(3);
    console.log(`Sample customers (${sampleCustomers.length}):`.white);
    
    sampleCustomers.forEach((customer, index) => {
      console.log(`  ${index + 1}. ${customer.firstName} ${customer.lastName || ''} - ${customer.phone}`.cyan);
      console.log(`     Email: ${customer.email || 'Not provided'}`.gray);
      console.log(`     DOB: ${customer.dob || 'Not provided'}`.gray);
      console.log(`     Address: ${customer.address?.line1 || 'Not provided'}`.gray);
      console.log(`     KYC Verified: ${customer.kyc?.isVerified ? 'Yes' : 'No'}`.gray);
    });

    // 4. Check relationships
    console.log('\n🔗 RELATIONSHIP INTEGRITY'.yellow.bold);
    
    // Check loans without customers
    const loansWithoutCustomers = await Loan.find({
      customerId: { $nin: await Customer.distinct('_id') }
    });
    console.log(`Loans without valid customers: ${loansWithoutCustomers.length}`.red);

    // Check payments without loans
    const paymentsWithoutLoans = await Payment.find({
      loanId: { $nin: await Loan.distinct('_id') }
    });
    console.log(`Payments without valid loans: ${paymentsWithoutLoans.length}`.red);

    // 5. Data quality metrics
    console.log('\n📈 DATA QUALITY METRICS'.yellow.bold);
    
    const customersWithEmail = await Customer.countDocuments({ email: { $ne: null, $exists: true } });
    const customersWithKYC = await Customer.countDocuments({ 'kyc.isVerified': true });
    const activeCustomers = await Customer.countDocuments({ isActive: true });
    
    console.log(`Customers with email: ${customersWithEmail}/${counts.customers} (${((customersWithEmail/counts.customers)*100).toFixed(1)}%)`.white);
    console.log(`Customers with verified KYC: ${customersWithKYC}/${counts.customers} (${((customersWithKYC/counts.customers)*100).toFixed(1)}%)`.white);
    console.log(`Active customers: ${activeCustomers}/${counts.customers} (${((activeCustomers/counts.customers)*100).toFixed(1)}%)`.white);

    // 6. Recent activity
    console.log('\n⏰ RECENT ACTIVITY'.yellow.bold);
    
    const recentCustomers = await Customer.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    console.log(`Customers added in last 7 days: ${recentCustomers}`.white);

    const recentLoans = await Loan.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    console.log(`Loans created in last 7 days: ${recentLoans}`.white);

    // 7. Summary
    console.log('\n📝 VERIFICATION SUMMARY'.green.bold);
    
    const issues = [];
    if (customersWithMissingData.length > 0) issues.push(`${customersWithMissingData.length} customers with missing data`);
    if (duplicatePhones.length > 0) issues.push(`${duplicatePhones.length} duplicate phone numbers`);
    if (loansWithoutCustomers.length > 0) issues.push(`${loansWithoutCustomers.length} orphaned loans`);
    if (paymentsWithoutLoans.length > 0) issues.push(`${paymentsWithoutLoans.length} orphaned payments`);

    if (issues.length === 0) {
      console.log('✅ Database integrity check passed! No critical issues found.'.green);
    } else {
      console.log('⚠️  Issues found:'.yellow);
      issues.forEach(issue => console.log(`   - ${issue}`.red));
    }

    console.log(`\n📊 Total records: ${total}`.cyan);
    console.log('🔍 Verification completed successfully!'.green.bold);

  } catch (error) {
    console.error('❌ Error during verification:', error.message.red);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB'.gray);
  }
};

// Run the verification
verifyDatabaseData();