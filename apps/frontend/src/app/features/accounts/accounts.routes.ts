import { Routes } from '@angular/router';
import { AccountCreatePage } from './pages/account-create-page/account-create-page';
import { AccountDetailsPage } from './pages/account-details-page/account-details-page';
import { AccountEditPage } from './pages/account-edit-page/account-edit-page';
import { AccountListPage } from './pages/account-list-page/account-list-page';

export const ACCOUNTS_ROUTES: Routes = [
    { path: '', component: AccountListPage },
    { path: 'create', component: AccountCreatePage },
    { path: ':id', component: AccountDetailsPage },
    { path: ':id/edit', component: AccountEditPage },
];
