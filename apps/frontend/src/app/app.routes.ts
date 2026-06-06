import { Routes } from '@angular/router';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { RegisterPage } from './features/auth/pages/register-page/register-page';
import { ForgotPasswordPage } from './features/auth/pages/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './features/auth/pages/reset-password-page/reset-password-page';
import { TermsOfServicesPage } from './features/auth/pages/terms-of-services-page/terms-of-services-page';
import { PrivacyPolicyPage } from './features/auth/pages/privacy-policy-page/privacy-policy-page';
import { ContactSupportPage } from './features/auth/pages/contact-support-page/contact-support-page';
import { Error404Page } from './features/auth/pages/error404-page/error404-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { OauthCallbackPage } from './features/auth/pages/oauth-callback-page/oauth-callback-page';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        children:[
            {
                path: 'login', 
                component: LoginPage,
            },
            {
                path: 'register', 
                component: RegisterPage,
            },
            {
                path: 'forgot-password', 
                component: ForgotPasswordPage,
            },
            {
                path: 'reset-password', 
                component: ResetPasswordPage,
            },
            {
                path: 'terms-of-services', 
                component: TermsOfServicesPage,
            },
            {
                path: 'privacy-policy', 
                component: PrivacyPolicyPage,
            },
            {
                path: 'contact-support',
                component: ContactSupportPage,
            },
            {
                path: 'errors',
                component: Error404Page,
            },
            {
                path: 'oauth-callback',
                component: OauthCallbackPage,
            },
        ],
    },
    {
        path: 'dashboard',
        canActivate:[authGuard],
        component: DashboardPage,
    }
];
