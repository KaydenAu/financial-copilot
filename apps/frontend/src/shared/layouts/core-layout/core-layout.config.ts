// Fallback message profile if a specific path isn't mapped
export const DEFAULT_HEADER_MESSAGE = 'Financial Copilot Workspace';

export interface NavigationItem {
    label: string;
    route: string;
    icon: string;
    headerMessage: (username?: string) => string; 
    exactOptions: { exact: boolean };
}

export const APP_NAVIGATION_CONFIG: NavigationItem[] = [
    {
        label: 'Dashboard', 
        route: '/dashboard', 
        icon: 'dashboard',
        headerMessage: (username) => `Welcome Back, ${username}!`,
        exactOptions: { exact: true }
    },
    {
        label: 'Transactions', 
        route: '/transactions', 
        icon: 'receipt_long',
        headerMessage: () => `All Transactions`,
        exactOptions: { exact: false }
    },
    { 
    label: 'Accounts', 
    route: '/accounts', 
    icon: 'account_balance_wallet',
    headerMessage: () => `All Accounts`,
    exactOptions: { exact: false }
  },
  { 
    label: 'Categories', 
    route: '/categories', 
    icon: 'insights',
    headerMessage: () => `All Categories`,
    exactOptions: { exact: false }
  },
  { 
    label: 'Reports', 
    route: '/reports', 
    icon: 'assessment',
    headerMessage: () => `All Reports`,
    exactOptions: { exact: false }
  },
  { 
    label: 'Budgets', 
    route: '/budgets', 
    icon: 'add_card', 
    headerMessage: () => `All Budgets`,
    exactOptions: { exact: false }
  },
  { 
    label: 'Saving Goals', 
    route: '/goals', 
    icon: 'track_changes', 
    headerMessage: () => `All Savings Goals.`,
    exactOptions: { exact: false }
  },
  { 
    label: 'Upload Files', 
    route: '/uploadfiles', 
    icon: 'upload_file',
    headerMessage: () => `Upload Files`,
    exactOptions: { exact: false }
  },
  { 
    label: 'Profile Settings', 
    route: '/profile', 
    icon: 'account_circle',
    headerMessage: () => `Profile Settings`,
    exactOptions: { exact: false }
  },
]

export const PROFILE_NAVIGATION_CONFIG: NavigationItem[] = [
    {
        label: 'Personal Info', 
        route: '/profile/personal-info', 
        icon: 'badge',
        headerMessage: () => `Configure Your Identity, Default Tracking Metrics and Reporting Rules`,
        exactOptions: { exact: true }
    },
    {
        label: 'Security & Password', 
        route: '/profile/security', 
        icon: 'security',
        headerMessage: () => `Update Security Settings`,
        exactOptions: { exact: false }
    },
    { 
      label: 'Notification Center', 
      route: '/profile/notification', 
      icon: 'notifications',
      headerMessage: () => `Manage Your Notifications`,
      exactOptions: { exact: false }
    },
    { 
      label: 'Contact Support', 
      route: '/auth/contact-support', 
      icon: 'contact_support',
      headerMessage: () => ``,
      exactOptions: { exact: false }
    },
    { 
      label: 'Back to Dashboard', 
      route: '/dashboard', 
      icon: 'arrow_back',
      headerMessage: (username) => `Welcome Back, ${username}!`,
      exactOptions: { exact: false }
    },
]
