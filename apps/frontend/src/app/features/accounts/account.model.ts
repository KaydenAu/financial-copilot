export const ACCOUNT_TYPES = ['Cash', 'Checking', 'Savings', 'Credit Card', 'Investment', 'Loan', 'Custom'] as const;

export interface Account {
    id: number;
    name: string;
    type: string;
    balance: number;
    currency: string;
    description?: string;
    createdAt: Date;
}

export interface AccountFormValue {
    name: string;
    type: string;
    balance: number;
    currency: string;
    description?: string;
}

export const MOCK_ACCOUNTS: Account[] = [
    {
        id: 1,
        name: 'Main Checking',
        type: 'Checking',
        balance: 4820.75,
        currency: 'RM',
        description: 'Primary operating account',
        createdAt: new Date('2026-01-15T10:00:00Z'),
    },
    {
        id: 2,
        name: 'Emergency Fund',
        type: 'Savings',
        balance: 15800,
        currency: 'RM',
        description: 'Rainy day reserve',
        createdAt: new Date('2026-02-02T10:00:00Z'),
    },
    {
        id: 3,
        name: 'Travel Card',
        type: 'Credit Card',
        balance: -420.38,
        currency: 'RM',
        description: 'Paid monthly for travel expenses',
        createdAt: new Date('2026-03-10T10:00:00Z'),
    },
];
