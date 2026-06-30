import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../account.model';

@Component({
    selector: 'app-account-summary',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="summary-grid">
      <article class="summary-card">
        <p>Total Balance</p>
        <h2>{{ totalBalance | currency: currency:'symbol':'1.2-2' }}</h2>
      </article>
      <article class="summary-card">
        <p>Accounts</p>
        <h2>{{ accounts.length }}</h2>
      </article>
      <article class="summary-card">
        <p>Average Balance</p>
        <h2>{{ averageBalance | currency: currency:'symbol':'1.2-2' }}</h2>
      </article>
      <article class="summary-card">
        <p>Highest Balance</p>
        <h2>{{ highestBalance | currency: currency:'symbol':'1.2-2' }}</h2>
      </article>
    </section>
  `,
    styleUrl: './account-summary.scss',
})
export class AccountSummary {
    @Input() accounts: Account[] = [];
    @Input() currency = 'RM';

    get totalBalance(): number {
        return this.accounts.reduce((sum, account) => sum + account.balance, 0);
    }

    get averageBalance(): number {
        return this.accounts.length ? this.totalBalance / this.accounts.length : 0;
    }

    get highestBalance(): number {
        return this.accounts.reduce((max, account) => Math.max(max, account.balance), 0);
    }
}
