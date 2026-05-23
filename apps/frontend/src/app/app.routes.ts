import { Routes } from '@angular/router';
import { LoginPage } from './features/auth/login-page/login-page';
import { RegisterPage } from './features/auth/register-page/register-page';
import { ForgotPasswordPage } from './features/auth/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './features/auth/reset-password-page/reset-password-page';
import { TermsOfServicesPage } from './features/auth/terms-of-services-page/terms-of-services-page';
import { PrivacyPolicyPage } from './features/auth/privacy-policy-page/privacy-policy-page';
import { ContactSupportPage } from './features/auth/contact-support-page/contact-support-page';
import { Error404Page } from './features/auth/error404-page/error404-page';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
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
        ],
    },
];
