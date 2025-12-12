const Customer = require('./customers.model');

class CustomerService {
  async createCustomer(customerData) {
    const customer = new Customer(customerData);
    await customer.save();
    return customer;
  }

  async getAllCustomers(filters = {}) {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query)
      .select('-documents.filePath')
      .sort({ createdAt: -1 });
    
    return customers;
  }

  async getCustomerById(customerId) {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  async updateCustomer(customerId, updateData) {
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    return customer;
  }

  async updateKYCStatus(customerId, kycData) {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    customer.kyc = {
      ...customer.kyc,
      ...kycData,
      verifiedAt: kycData.status === 'verified' ? new Date() : customer.kyc.verifiedAt
    };

    await customer.save();
    return customer;
  }

  async addDocument(customerId, documentData) {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    customer.documents.push(documentData);
    await customer.save();
    return customer;
  }

  async searchCustomers(searchTerm) {
    const customers = await Customer.find({
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(10);
    
    return customers;
  }
}

module.exports = new CustomerService();