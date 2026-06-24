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
                    { path: 'support/contact', component: ContactSupportPage}
                ]
            },
            { path: 'reports', component: ReportPage},
        ]
    },
    // Support routes
    {
        path: 'support',
        children: [
            {
                path: 'contact',
                component: ContactSupportPage,
            }
        ],
    },
    // Error routes
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
