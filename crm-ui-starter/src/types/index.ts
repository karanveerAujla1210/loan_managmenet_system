export type UserRole = 'admin' | 'loan_officer' | 'collector' | 'analyst' | 'manager'

export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  panNumber: string
  status: 'active' | 'inactive' | 'closed' | 'default'
  createdAt: string
  loanCount: number
  totalLoanAmount: number
  profileImage?: string
}

export type Loan = {
  id: string
  loanId: string
  customerId: string
  amount: number
  principalAmount: number
  interestRate: number
  tenure: number
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  disbursedAmount: number
  collectedAmount: number
  dpd: number
  status: 'active' | 'closed' | 'default'
  createdAt: string
  nextPaymentDue: string
  bucket: 'current' | 'bucket1' | 'bucket2' | 'bucket3' | 'bucket4'
}

export type DPDBucket = 'current' | 'bucket1' | 'bucket2' | 'bucket3' | 'bucket4'

export type KPIData = {
  label: string
  value: string | number
  change?: number
  icon?: string
  color?: 'primary' | 'success' | 'warning' | 'danger'
}
