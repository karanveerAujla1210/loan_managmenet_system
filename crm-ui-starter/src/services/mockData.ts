import { Customer, Loan } from '../types'

export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Rajesh Kumar',
    email: 'rajesh@business.com',
    phone: '+91-9876543210',
    panNumber: 'ABCD1234E',
    status: 'active',
    createdAt: '2024-01-15',
    loanCount: 2,
    totalLoanAmount: 500000,
    profileImage: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=1741FF&color=fff'
  },
  {
    id: 'cust-002',
    name: 'Priya Sharma',
    email: 'priya@retail.com',
    phone: '+91-9876543211',
    panNumber: 'EFGH5678I',
    status: 'active',
    createdAt: '2024-02-01',
    loanCount: 1,
    totalLoanAmount: 300000,
    profileImage: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=7C3AED&color=fff'
  },
  {
    id: 'cust-003',
    name: 'Amit Patel',
    email: 'amit@trade.com',
    phone: '+91-9876543212',
    panNumber: 'IJKL9012K',
    status: 'active',
    createdAt: '2024-01-20',
    loanCount: 3,
    totalLoanAmount: 750000,
    profileImage: 'https://ui-avatars.com/api/?name=Amit+Patel&background=10B981&color=fff'
  },
  {
    id: 'cust-004',
    name: 'Neha Singh',
    email: 'neha@tech.com',
    phone: '+91-9876543213',
    panNumber: 'MNOP3456L',
    status: 'closed',
    createdAt: '2023-12-10',
    loanCount: 1,
    totalLoanAmount: 250000,
    profileImage: 'https://ui-avatars.com/api/?name=Neha+Singh&background=F59E0B&color=fff'
  },
  {
    id: 'cust-005',
    name: 'Vikram Gupta',
    email: 'vikram@import.com',
    phone: '+91-9876543214',
    panNumber: 'QRST7890M',
    status: 'default',
    createdAt: '2023-11-05',
    loanCount: 2,
    totalLoanAmount: 600000,
    profileImage: 'https://ui-avatars.com/api/?name=Vikram+Gupta&background=EF4444&color=fff'
  }
]

export const mockLoans: Loan[] = [
  {
    id: 'loan-001',
    loanId: 'LA-00001',
    customerId: 'cust-001',
    amount: 300000,
    principalAmount: 300000,
    interestRate: 12,
    tenure: 36,
    frequency: 'monthly',
    disbursedAmount: 300000,
    collectedAmount: 180000,
    dpd: 0,
    status: 'active',
    createdAt: '2024-01-15',
    nextPaymentDue: '2024-12-20',
    bucket: 'current'
  },
  {
    id: 'loan-002',
    loanId: 'LA-00002',
    customerId: 'cust-002',
    amount: 300000,
    principalAmount: 300000,
    interestRate: 13,
    tenure: 24,
    frequency: 'monthly',
    disbursedAmount: 300000,
    collectedAmount: 150000,
    dpd: 15,
    status: 'active',
    createdAt: '2024-02-01',
    nextPaymentDue: '2024-12-05',
    bucket: 'bucket1'
  },
  {
    id: 'loan-003',
    loanId: 'LA-00003',
    customerId: 'cust-003',
    amount: 400000,
    principalAmount: 400000,
    interestRate: 11,
    tenure: 48,
    frequency: 'monthly',
    disbursedAmount: 400000,
    collectedAmount: 200000,
    dpd: 45,
    status: 'active',
    createdAt: '2024-01-20',
    nextPaymentDue: '2024-11-25',
    bucket: 'bucket2'
  }
]

export const getDashboardKPIs = () => ({
  totalCustomers: mockCustomers.length,
  activeLoans: mockLoans.filter(l => l.status === 'active').length,
  totalDisbursed: mockLoans.reduce((sum, l) => sum + l.disbursedAmount, 0),
  totalCollected: mockLoans.reduce((sum, l) => sum + l.collectedAmount, 0),
  overdueCases: mockLoans.filter(l => l.dpd > 0).length,
  portfolio: mockLoans.reduce((sum, l) => sum + l.principalAmount, 0)
})

export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(c => c.id === id)
}

export const getLoansByCustomerId = (customerId: string): Loan[] => {
  return mockLoans.filter(l => l.customerId === customerId)
}
