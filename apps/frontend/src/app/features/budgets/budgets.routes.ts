import { Routes } from '@angular/router';
import { BudgetCreatePage } from './pages/budget-create-page/budget-create-page';
import { BudgetDetailsPage } from './pages/budget-details-page/budget-details-page';
import { BudgetEditPage } from './pages/budget-edit-page/budget-edit-page';
import { BudgetListPage } from './pages/budget-list-page/budget-list-page';

export const BUDGETS_ROUTES: Routes = [
    { path: '', component: BudgetListPage },
    { path: 'create', component: BudgetCreatePage },
    { path: ':id', component: BudgetDetailsPage },
    { path: ':id/edit', component: BudgetEditPage },
];
