import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  TrendingUp,
  Settings,
  Banknote,
  FileText,
  Phone,
  BarChart3,
  User,
} from 'lucide-react';

// Central navigation configuration used by all sidebar variants
export const NAV_ITEMS = [
  { id: 'dashboard', title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['all'] },
  { id: 'credit', title: 'Credit Management', path: '/credit', icon: CreditCard, roles: ['advisor', 'manager', 'admin'] },
  { id: 'loans', title: 'Disbursed Loans', path: '/loans', icon: Banknote, roles: ['all'] },
  { id: 'overdue', title: 'Overdue Management', path: '/overdue/buckets', icon: FileText, roles: ['collector', 'manager', 'admin'] },
  { id: 'legal', title: 'Legal Cases', path: '/legal-cases', icon: FileText, roles: ['legal', 'admin'] },
  { id: 'collections', title: 'Payment Processing', path: '/collections', icon: Phone, roles: ['collector', 'manager', 'admin'] },
  { id: 'reconciliation', title: 'Bank Reconciliation', path: '/reconciliation/utr', icon: TrendingUp, roles: ['admin', 'finance'] },
  { id: 'customers', title: 'Customers', path: '/customers', icon: Users, roles: ['all'] },
  { id: 'reports', title: 'Reports & Analytics', path: '/mis/reports', icon: BarChart3, roles: ['manager', 'admin', 'investor'] },
  { id: 'settings', title: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
  { id: 'profile', title: 'Profile', path: '/profile', icon: User, roles: ['all'] },
];

export default NAV_ITEMS;
