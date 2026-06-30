import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../account.model';

@Component({
    selector: 'app-balance-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
    <article class="widget">
      <div>
        <p class="eyebrow">Total Balance</p>
        <h2>{{ totalBalance | currency: currency:'symbol':'1.2-2' }}</h2>
      </div>
      <p>{{ accounts.length }} linked accounts</p>
    </article>
  `,
    styleUrl: './balance-widget.scss',
})
export class BalanceWidget {
    @Input() accounts: Account[] = [];
    @Input() currency = 'RM';

    get totalBalance(): number {
        return this.accounts.reduce((sum, account) => sum + account.balance, 0);
    }
}
