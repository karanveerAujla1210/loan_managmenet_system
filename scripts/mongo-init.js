// MongoDB initialization script for production
db = db.getSiblingDB('loan_management_prod');

// Create application user
db.createUser({
  user: 'loanapp',
  pwd: 'secure_app_password_here',
  roles: [
    {
      role: 'readWrite',
      db: 'loan_management_prod'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

db.customers.createIndex({ customerId: 1 }, { unique: true });
db.customers.createIndex({ email: 1 });
db.customers.createIndex({ phone: 1 });
db.customers.createIndex({ createdAt: 1 });

db.loans.createIndex({ loanId: 1 }, { unique: true });
db.loans.createIndex({ customerId: 1 });
db.loans.createIndex({ status: 1 });
db.loans.createIndex({ createdAt: 1 });
db.loans.createIndex({ dueDate: 1 });

db.payments.createIndex({ paymentId: 1 }, { unique: true });
db.payments.createIndex({ loanId: 1 });
db.payments.createIndex({ customerId: 1 });
db.payments.createIndex({ paymentDate: 1 });
db.payments.createIndex({ createdAt: 1 });

db.schedules.createIndex({ loanId: 1 });
db.schedules.createIndex({ dueDate: 1 });
db.schedules.createIndex({ status: 1 });

db.collections.createIndex({ loanId: 1 });
db.collections.createIndex({ customerId: 1 });
db.collections.createIndex({ status: 1 });
db.collections.createIndex({ createdAt: 1 });

print('Database initialized successfully with indexes');