export interface SavingsGoal {
    id: number;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    description?: string;
}

export interface SavingsGoalFormValue {
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    description?: string;
}

export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
    { id: 1, title: 'Vacation Fund', targetAmount: 5000, currentAmount: 3200, deadline: new Date('2026-12-01'), description: 'Trip to Japan' },
    { id: 2, title: 'New Laptop', targetAmount: 2200, currentAmount: 1540, deadline: new Date('2026-09-15'), description: 'Upgrade for work and travel' },
    { id: 3, title: 'Home Down Payment', targetAmount: 40000, currentAmount: 11800, deadline: new Date('2027-06-30'), description: 'Long term ownership goal' },
];
