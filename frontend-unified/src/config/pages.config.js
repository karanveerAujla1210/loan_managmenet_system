// Complete page structure mapped to loan lifecycle
export const PAGES = {
  // STAGE 1: LEAD & APPLICATION
  LEADS: {
    path: '/leads',
    name: 'Lead Dashboard',
    icon: 'Users',
    roles: ['telecaller', 'manager', 'admin'],
    stage: 'LEAD',
    description: 'Capture demand and manage leads'
  },
  APPLICATION: {
    path: '/application',
    name: 'Loan Application',
    icon: 'FileText',
    roles: ['customer', 'telecaller', 'manager', 'admin'],
    stage: 'APPLICATION',
    description: 'Collect structured loan application data'
  },

  // STAGE 2: CREDIT & RISK
  CREDIT_ASSESSMENT: {
    path: '/credit-assessment',
    name: 'Credit Assessment',
    icon: 'BarChart3',
    roles: ['credit_analyst', 'manager', 'admin'],
    stage: 'CREDIT',
    description: 'Analyze risk and recommend approval'
  },
  APPROVAL: {
    path: '/approval',
    name: 'Approval',
    icon: 'CheckCircle',
    roles: ['manager', 'admin'],
    stage: 'APPROVAL',
    description: 'Final authority to approve loans'
  },

  // STAGE 3: DISBURSEMENT
  DISBURSEMENT: {
    path: '/disbursement',
    name: 'Disbursement Queue',
    icon: 'Send',
    roles: ['operations', 'finance', 'manager', 'admin'],
    stage: 'DISBURSEMENT',
    description: 'Release approved loans'
  },

  // STAGE 4: REPAYMENT & LIVE LOAN
  ACTIVE_LOANS: {
    path: '/active-loans',
    name: 'Active Loans',
    icon: 'TrendingUp',
    roles: ['operations', 'manager', 'admin'],
    stage: 'REPAYMENT',
    description: 'Monitor active loan portfolio'
  },
  LOAN_DETAIL: {
    path: '/loan/:id',
    name: 'Loan 360 View',
    icon: 'Eye',
    roles: ['all'],
    stage: 'REPAYMENT',
    description: 'Single source of truth for loan'
  },

  // STAGE 5: COLLECTIONS
  COLLECTIONS_DASHBOARD: {
    path: '/collections',
    name: 'Collections Dashboard',
    icon: 'AlertCircle',
    roles: ['collections_head', 'manager', 'admin'],
    stage: 'COLLECTIONS',
    description: 'Prevent loss through collections'
  },
  COLLECTOR_WORKLIST: {
    path: '/collector-worklist',
    name: 'My Cases',
    icon: 'ListTodo',
    roles: ['collector'],
    stage: 'COLLECTIONS',
    description: 'Daily execution for collectors'
  },

  // STAGE 6: LEGAL & RESOLUTION
  LEGAL_DASHBOARD: {
    path: '/legal',
    name: 'Legal Dashboard',
    icon: 'Scale',
    roles: ['legal_officer', 'manager', 'admin'],
    stage: 'LEGAL',
    description: 'Manage legal escalations'
  },

  // STAGE 7: CLOSURE
  LOAN_CLOSURE: {
    path: '/closure',
    name: 'Loan Closure',
    icon: 'Lock',
    roles: ['operations', 'finance', 'manager', 'admin'],
    stage: 'CLOSURE',
    description: 'Close loans cleanly'
  },

  // STAGE 8: MIS & CONTROL
  MIS_REPORTS: {
    path: '/mis-reports',
    name: 'MIS Reports',
    icon: 'BarChart2',
    roles: ['manager', 'admin', 'coo'],
    stage: 'MIS',
    description: 'COO command center'
  },

  // SYSTEM-WIDE
  USERS: {
    path: '/users',
    name: 'User Management',
    icon: 'Users',
    roles: ['admin'],
    stage: 'SYSTEM',
    description: 'Create users and assign roles'
  },
  AUDIT_LOG: {
    path: '/audit-log',
    name: 'Audit Log',
    icon: 'History',
    roles: ['admin', 'manager'],
    stage: 'SYSTEM',
    description: 'Who did what, when'
  },
  CONFIGURATION: {
    path: '/configuration',
    name: 'Configuration',
    icon: 'Settings',
    roles: ['admin'],
    stage: 'SYSTEM',
    description: 'Product rules and settings'
  }
};

// Navigation structure by role
export const NAVIGATION_BY_ROLE = {
  customer: [
    PAGES.APPLICATION,
    PAGES.ACTIVE_LOANS,
    PAGES.LOAN_DETAIL
  ],
  telecaller: [
    PAGES.LEADS,
    PAGES.APPLICATION,
    PAGES.ACTIVE_LOANS
  ],
  credit_analyst: [
    PAGES.CREDIT_ASSESSMENT,
    PAGES.ACTIVE_LOANS,
    PAGES.LOAN_DETAIL
  ],
  manager: [
    PAGES.LEADS,
    PAGES.APPLICATION,
    PAGES.CREDIT_ASSESSMENT,
    PAGES.APPROVAL,
    PAGES.DISBURSEMENT,
    PAGES.ACTIVE_LOANS,
    PAGES.COLLECTIONS_DASHBOARD,
    PAGES.LEGAL_DASHBOARD,
    PAGES.MIS_REPORTS,
    PAGES.AUDIT_LOG
  ],
  operations: [
    PAGES.DISBURSEMENT,
    PAGES.ACTIVE_LOANS,
    PAGES.LOAN_CLOSURE,
    PAGES.MIS_REPORTS
  ],
  collector: [
    PAGES.COLLECTOR_WORKLIST,
    PAGES.ACTIVE_LOANS,
    PAGES.LOAN_DETAIL
  ],
  collections_head: [
    PAGES.COLLECTIONS_DASHBOARD,
    PAGES.ACTIVE_LOANS,
    PAGES.MIS_REPORTS
  ],
  legal_officer: [
    PAGES.LEGAL_DASHBOARD,
    PAGES.ACTIVE_LOANS,
    PAGES.LOAN_DETAIL
  ],
  finance: [
    PAGES.DISBURSEMENT,
    PAGES.ACTIVE_LOANS,
    PAGES.LOAN_CLOSURE,
    PAGES.MIS_REPORTS
  ],
  admin: [
    PAGES.LEADS,
    PAGES.APPLICATION,
    PAGES.CREDIT_ASSESSMENT,
    PAGES.APPROVAL,
    PAGES.DISBURSEMENT,
    PAGES.ACTIVE_LOANS,
    PAGES.COLLECTIONS_DASHBOARD,
    PAGES.LEGAL_DASHBOARD,
    PAGES.LOAN_CLOSURE,
    PAGES.MIS_REPORTS,
    PAGES.USERS,
    PAGES.AUDIT_LOG,
    PAGES.CONFIGURATION
  ],
  coo: [
    PAGES.MIS_REPORTS,
    PAGES.AUDIT_LOG
  ]
};

// Loan lifecycle stages
export const LOAN_STAGES = {
  LEAD: { order: 1, label: 'Lead', color: '#3B82F6' },
  APPLICATION: { order: 2, label: 'Application', color: '#8B5CF6' },
  CREDIT: { order: 3, label: 'Credit Review', color: '#EC4899' },
  APPROVAL: { order: 4, label: 'Approval', color: '#F59E0B' },
  DISBURSEMENT: { order: 5, label: 'Disbursement', color: '#10B981' },
  REPAYMENT: { order: 6, label: 'Repayment', color: '#06B6D4' },
  COLLECTIONS: { order: 7, label: 'Collections', color: '#EF4444' },
  LEGAL: { order: 8, label: 'Legal', color: '#6366F1' },
  CLOSURE: { order: 9, label: 'Closure', color: '#6B7280' }
};
