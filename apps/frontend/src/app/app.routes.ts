import { Routes } from '@angular/router';
import { LoginPage } from './features/auth/login-page/login-page';
import { RegisterPage } from './features/auth/register-page/register-page';
import { ForgotPasswordPage } from './features/auth/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './features/auth/reset-password-page/reset-password-page';
import { TermsOfServicesPage } from './features/auth/terms-of-services-page/terms-of-services-page';
import { PrivacyPolicyPage } from './features/auth/privacy-policy-page/privacy-policy-page';
import { ContactSupportPage } from './features/support/contact-support-page/contact-support-page';
import { NotFoundPage } from './features/error/not-found-page/not-found-page';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        children: [
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
            }
        ],
    },

    // Support routes
    {
        path: 'support',
        children: [
            {
                path: 'contact-support',
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
    {
        path: '**',
        redirectTo: 'error/404',
    },
];
