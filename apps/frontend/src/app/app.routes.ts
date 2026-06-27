import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';
import { CoreLayout } from '../shared/layouts/core-layout/core-layout';

import { LoginPage } from './features/auth/pages/login-page/login-page';
import { RegisterPage } from './features/auth/pages/register-page/register-page';
import { ForgotPasswordPage } from './features/auth/pages/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './features/auth/pages/reset-password-page/reset-password-page';
import { TermsOfServicesPage } from './features/auth/pages/terms-of-services-page/terms-of-services-page';
import { PrivacyPolicyPage } from './features/auth/pages/privacy-policy-page/privacy-policy-page';
import { ContactSupportPage } from './features/support/pages/contact-support-page/contact-support-page';
import { NotFoundPage } from './features/error/not-found-page/not-found-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { OauthCallbackPage } from './features/auth/pages/oauth-callback-page/oauth-callback-page';
import { PersonalInfoPage } from './features/profile/pages/personal-info-page/personal-info-page';
import { SecurityPage } from './features/profile/pages/security-page/security-page';
import { ReportPage } from './features/reports/report-page/report-page';
import { CategoriesPage } from './features/categories/pages/categories-page/categories-page';
import { TransactionPage } from './features/transactions/transaction-page/transaction-page';
import { AccountListPage } from './features/accounts/pages/account-list-page/account-list-page';
import { AccountCreatePage } from './features/accounts/pages/account-create-page/account-create-page';
import { AccountDetailsPage } from './features/accounts/pages/account-details-page/account-details-page';
import { AccountEditPage } from './features/accounts/pages/account-edit-page/account-edit-page';
import { BudgetListPage } from './features/budgets/pages/budget-list-page/budget-list-page';
import { BudgetCreatePage } from './features/budgets/pages/budget-create-page/budget-create-page';
import { BudgetDetailsPage } from './features/budgets/pages/budget-details-page/budget-details-page';
import { BudgetEditPage } from './features/budgets/pages/budget-edit-page/budget-edit-page';
import { GoalListPage } from './features/savings-goals/pages/goal-list-page/goal-list-page';
import { GoalCreatePage } from './features/savings-goals/pages/goal-create-page/goal-create-page';
import { GoalDetailsPage } from './features/savings-goals/pages/goal-details-page/goal-details-page';
import { GoalEditPage } from './features/savings-goals/pages/goal-edit-page/goal-edit-page';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth',
        children: [
            { path: 'login', component: LoginPage },
            { path: 'register', component: RegisterPage },
            { path: 'forgot-password', component: ForgotPasswordPage },
            { path: 'reset-password', component: ResetPasswordPage },
            { path: 'terms-of-services', component: TermsOfServicesPage },
            { path: 'privacy-policy', component: PrivacyPolicyPage },
            { path: 'oauth-callback', component: OauthCallbackPage },
        ],
    },
    {
        path: '',
        component: CoreLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardPage },
            {
                path: 'profile',
                children: [
                    { path: '', redirectTo: 'personal-info', pathMatch: 'full' },
                    { path: 'personal-info', component: PersonalInfoPage },
                    { path: 'security', component: SecurityPage },
                    {
                        path: 'support',
                        children: [{ path: 'contact', component: ContactSupportPage }],
                    },
                ]
            },
            { path: 'reports', component: ReportPage },
            { path: 'categories', component: CategoriesPage },
            { path: 'transactions', component: TransactionPage },
            { path: 'accounts', component: AccountListPage },
            { path: 'accounts/create', component: AccountCreatePage },
            { path: 'accounts/:id', component: AccountDetailsPage },
            { path: 'accounts/:id/edit', component: AccountEditPage },
            { path: 'budgets', component: BudgetListPage },
            { path: 'budgets/create', component: BudgetCreatePage },
            { path: 'budgets/:id', component: BudgetDetailsPage },
            { path: 'budgets/:id/edit', component: BudgetEditPage },
            { path: 'savings-goals', component: GoalListPage },
            { path: 'savings-goals/create', component: GoalCreatePage },
            { path: 'savings-goals/:id', component: GoalDetailsPage },
            { path: 'savings-goals/:id/edit', component: GoalEditPage },
        ]
    },
    {
        path: 'error',
        children: [
            {
                path: '404',
                component: NotFoundPage,
            },
        ],
    },
    // Fallback route
    { path: '**', redirectTo: 'error/404' },
];