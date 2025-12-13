// Declarative navigation configuration inspired by CoreUI
// Defines all menu items, routes, icons, badges, and role-based access

import {
  LayoutDashboard,
  Users,
  Zap,
  CreditCard,
  TrendingUp,
  FileText,
  Settings,
  BarChart3,
  Lock,
  HelpCircle,
} from 'lucide-react'

export type UserRole = 'admin' | 'loan_officer' | 'collector' | 'analyst' | 'manager'

export interface NavItem {
  id: string
  component: 'NavItem' | 'NavGroup'
  name: string
  to?: string
  icon?: any
  badge?: {
    color: string
    text: string | number
  }
  roles?: UserRole[] // undefined = visible to all authenticated users
  children?: NavItem[]
  divider?: boolean
}

export const navigation: NavItem[] = [
  {
    id: 'dashboard',
    component: 'NavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'customers',
    component: 'NavGroup',
    name: 'Customers',
    icon: Users,
    roles: ['loan_officer', 'collector', 'analyst', 'manager', 'admin'],
    children: [
      {
        id: 'customers-list',
        component: 'NavItem',
        name: 'All Customers',
        to: '/customers',
        icon: Users,
      },
      {
        id: 'customers-new',
        component: 'NavItem',
        name: 'New Customer',
        to: '/customers/new',
        icon: Users,
        roles: ['loan_officer', 'manager', 'admin'],
      },
    ],
  },
  {
    id: 'lending',
    component: 'NavGroup',
    name: 'Lending',
    icon: CreditCard,
    roles: ['loan_officer', 'analyst', 'manager', 'admin'],
    children: [
      {
        id: 'credit-analysis',
        component: 'NavItem',
        name: 'Credit Analysis',
        to: '/credit-analysis',
        icon: Zap,
        roles: ['loan_officer', 'analyst', 'manager', 'admin'],
      },
      {
        id: 'approvals',
        component: 'NavItem',
        name: 'Loan Approvals',
        to: '/approvals',
        icon: CreditCard,
        roles: ['manager', 'admin'],
        badge: { color: 'info', text: '5' },
      },
    ],
  },
  {
    id: 'collections',
    component: 'NavItem',
    name: 'Collections',
    to: '/collections',
    icon: TrendingUp,
    roles: ['collector', 'manager', 'admin'],
    badge: { color: 'danger', text: '12' },
  },
  {
    id: 'closures',
    component: 'NavItem',
    name: 'Case Closure',
    to: '/case-closure',
    icon: Zap,
    roles: ['loan_officer', 'manager', 'admin'],
  },
  {
    id: 'reports',
    component: 'NavGroup',
    name: 'Reports & Analytics',
    icon: BarChart3,
    roles: ['analyst', 'manager', 'admin'],
    children: [
      {
        id: 'reports-list',
        component: 'NavItem',
        name: 'Reports',
        to: '/reports',
        icon: FileText,
      },
      {
        id: 'portfolio-health',
        component: 'NavItem',
        name: 'Portfolio Health',
        to: '/portfolio-health',
        icon: BarChart3,
      },
      {
        id: 'performance',
        component: 'NavItem',
        name: 'Performance',
        to: '/performance',
        icon: TrendingUp,
      },
    ],
  },
  {
    id: 'admin',
    component: 'NavGroup',
    name: 'Administration',
    icon: Lock,
    roles: ['admin'],
    children: [
      {
        id: 'users',
        component: 'NavItem',
        name: 'Users',
        to: '/admin/users',
        icon: Users,
      },
      {
        id: 'settings-admin',
        component: 'NavItem',
        name: 'System Settings',
        to: '/admin/settings',
        icon: Settings,
      },
      {
        id: 'audit',
        component: 'NavItem',
        name: 'Audit Logs',
        to: '/admin/audit',
        icon: FileText,
      },
    ],
  },
  {
    id: 'settings',
    component: 'NavItem',
    name: 'Settings',
    to: '/settings',
    icon: Settings,
  },
  {
    id: 'help',
    component: 'NavItem',
    name: 'Help & Support',
    to: '/help',
    icon: HelpCircle,
  },
]

/**
 * Filter navigation items based on user role
 * @param items Navigation items to filter
 * @param userRole Current user's role
 * @returns Filtered navigation items
 */
export const filterNavByRole = (items: NavItem[], userRole: UserRole): NavItem[] => {
  return items
    .filter((item) => {
      // Show item if no roles are specified (public) or user has the required role
      if (!item.roles) return true
      return item.roles.includes(userRole)
    })
    .map((item) => {
      // Filter children recursively if they exist
      if (item.children) {
        return {
          ...item,
          children: filterNavByRole(item.children, userRole),
        }
      }
      return item
    })
    .filter((item) => {
      // Remove groups with no children after filtering
      if (item.component === 'NavGroup' && item.children?.length === 0) {
        return false
      }
      return true
    })
}

/**
 * Find a navigation item by route
 * @param items Navigation items to search
 * @param route Route to find
 * @returns Found navigation item or undefined
 */
export const findNavByRoute = (items: NavItem[], route: string): NavItem | undefined => {
  for (const item of items) {
    if (item.to === route) return item
    if (item.children) {
      const found = findNavByRoute(item.children, route)
      if (found) return found
    }
  }
  return undefined
}

/**
 * Get breadcrumb trail for a route
 * @param items Navigation items to search
 * @param route Route to get breadcrumb for
 * @returns Array of breadcrumb items
 */
export const getBreadcrumbs = (items: NavItem[], route: string): NavItem[] => {
  const breadcrumbs: NavItem[] = []

  const findPath = (items: NavItem[], target: string): boolean => {
    for (const item of items) {
      if (item.to === target) {
        breadcrumbs.push(item)
        return true
      }
      if (item.children) {
        if (findPath(item.children, target)) {
          breadcrumbs.unshift(item)
          return true
        }
      }
    }
    return false
  }

  findPath(items, route)
  return breadcrumbs
}
