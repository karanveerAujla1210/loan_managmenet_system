import {
  LayoutDashboard,
  Users,
  CreditCard,
  TrendingUp,
  Settings,
  Banknote,
  FileText,
  BarChart3,
  User,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['all'] },
  { id: 'credit', title: 'Credit Management', path: '/credit-management', icon: CreditCard, roles: ['advisor', 'manager', 'admin'] },
  { id: 'loans', title: 'Disbursed Loans', path: '/loans', icon: Banknote, roles: ['all'] },
  { id: 'overdue', title: 'Overdue Management', path: '/overdue', icon: FileText, roles: ['collector', 'manager', 'admin'] },
  { id: 'legal', title: 'Legal Cases', path: '/legal', icon: FileText, roles: ['legal', 'admin'] },
  { id: 'collections', title: 'Payment Processing', path: '/payments', icon: CreditCard, roles: ['collector', 'manager', 'admin'] },
  { id: 'reconciliation', title: 'Bank Reconciliation', path: '/reconciliation', icon: TrendingUp, roles: ['admin', 'finance'] },
  { id: 'customers', title: 'Customers', path: '/customers', icon: Users, roles: ['all'] },
  { id: 'reports', title: 'Reports & Analytics', path: '/reports', icon: BarChart3, roles: ['manager', 'admin', 'investor'] },
  { id: 'settings', title: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
  { id: 'profile', title: 'Profile', path: '/profile', icon: User, roles: ['all'] },
];

export default NAV_ITEMS;
