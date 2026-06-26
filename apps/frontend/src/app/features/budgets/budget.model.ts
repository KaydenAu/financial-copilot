export const BUDGET_PERIODS = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'] as const;

export interface Budget {
    id: number;
    category: string;
    limit: number;
    spent: number;
    period: string;
    startDate: Date;
    endDate: Date;
}

export interface BudgetFormValue {
    category: string;
    limit: number;
    spent: number;
    period: string;
    startDate: Date;
    endDate: Date;
}

export const MOCK_BUDGETS: Budget[] = [
    { id: 1, category: 'Groceries', limit: 600, spent: 432.35, period: 'Monthly', startDate: new Date('2026-06-01'), endDate: new Date('2026-06-30') },
    { id: 2, category: 'Transport', limit: 240, spent: 268.12, period: 'Monthly', startDate: new Date('2026-06-01'), endDate: new Date('2026-06-30') },
    { id: 3, category: 'Entertainment', limit: 180, spent: 76.5, period: 'Monthly', startDate: new Date('2026-06-01'), endDate: new Date('2026-06-30') },
];
