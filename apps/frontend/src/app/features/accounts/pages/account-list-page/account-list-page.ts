import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AccountsService } from '../../accounts.service';
import { Account } from '../../account.model';
import { AccountCard } from '../../components/account-card/account-card';
import { AccountSummary } from '../../components/account-summary/account-summary';
import { BalanceWidget } from '../../components/balance-widget/balance-widget';

@Component({
    selector: 'app-account-list-page',
    standalone: true,
    imports: [CommonModule, AccountCard, AccountSummary, BalanceWidget],
//     template: `
//     <section class="page-shell">
//       <header class="hero">
//         <div>
//           <p class="eyebrow">Accounts</p>
//           <h1>Fintech-style account management</h1>
//           <p>Search, filter, and monitor balances across your account portfolio.</p>
//         </div>
//         <button type="button" (click)="createAccount()">New account</button>
//       </header>

//       <app-account-summary [accounts]="filteredAccounts"></app-account-summary>
//       <app-balance-widget [accounts]="filteredAccounts"></app-balance-widget>

//       <label class="search">
//         <span>Search accounts</span>
//         <input type="search" [value]="searchText" (input)="onSearch($event)" />
//       </label>

//       <div class="grid">
//         <app-account-card
//           *ngFor="let account of filteredAccounts"
//           [account]="account"
//           (view)="viewAccount($event)"
//           (edit)="editAccount($event)"
//           (remove)="removeAccount($event)"
//         ></app-account-card>
//       </div>
//     </section>
//   `,
    template:`
    <section class="page-shell">
    <header class="page-shell__hero hero">
        <div class="hero__content">
        <p class="hero__eyebrow">Accounts</p>
        <h1 class="hero__heading">Fintech-style account management</h1>
        <p class="hero__description">Search, filter, and monitor balances across your account portfolio.</p>
        </div>
        <button class="hero__button" type="button" (click)="createAccount()">New account</button>
        <hr class="hero__divider"/>
    </header>
    
    <app-account-summary [accounts]="filteredAccounts"></app-account-summary>
    <app-balance-widget [accounts]="filteredAccounts"></app-balance-widget>
    <hr class="hero__divider"/>
    <label class="page-shell__search search-box">
        <span class="search-box__label">Search accounts</span>
        <input class="search-box__input" type="search" [value]="searchText" (input)="onSearch($event)" />
    </label>

    <div class="page-shell__grid">
        <app-account-card
        *ngFor="let account of filteredAccounts"
        [account]="account"
        (view)="viewAccount($event)"
        (edit)="editAccount($event)"
        (remove)="removeAccount($event)"
        ></app-account-card>
    </div>
    </section>
    `,
    styleUrl: './account-list-page.scss',
})
export class AccountListPage implements OnInit {
    private readonly accountsService = inject(AccountsService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    accounts: Account[] = [];
    filteredAccounts: Account[] = [];
    searchText = '';

    ngOnInit(): void {
        this.accountsService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((accounts) => {
            this.accounts = accounts;
            this.applyFilters();
        });
    }

    onSearch(event: Event): void {
        this.searchText = (event.target as HTMLInputElement).value;
        this.applyFilters();
    }

    createAccount(): void {
        this.router.navigate(['/accounts/create']);
    }

    viewAccount(account: Account): void {
        this.router.navigate(['/accounts', account.id]);
    }

    editAccount(account: Account): void {
        this.router.navigate(['/accounts', account.id, 'edit']);
    }

    removeAccount(account: Account): void {
        if (!confirm(`Delete ${account.name}?`)) {
            return;
        }

        this.accountsService.delete(account.id).subscribe(() => this.applyFilters());
    }

    private applyFilters(): void {
        const query = this.searchText.trim().toLowerCase();
        this.filteredAccounts = this.accounts.filter((account) => {
            if (!query) {
                return true;
            }

            return [account.name, account.type, account.currency, account.description ?? '']
                .join(' ')
                .toLowerCase()
                .includes(query);
        });
    }
}
