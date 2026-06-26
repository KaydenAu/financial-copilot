import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AccountsService } from '../../accounts.service';
import { Account } from '../../account.model';
import { AccountSummary } from '../../components/account-summary/account-summary';
import { BalanceWidget } from '../../components/balance-widget/balance-widget';

@Component({
    selector: 'app-account-details-page',
    standalone: true,
    imports: [CommonModule, AccountSummary, BalanceWidget],
    template: `
    <section class="page-shell" *ngIf="account; else loading">
      <header class="hero">
        <div>
          <p class="eyebrow">Account details</p>
          <h1>{{ account.name }}</h1>
          <p>{{ account.type }} · Created {{ account.createdAt | date: 'mediumDate' }}</p>
        </div>
        <div class="actions">
          <button type="button" (click)="goBack()">Back</button>
          <button type="button" (click)="editAccount()">Edit</button>
        </div>
      </header>

      <app-balance-widget [accounts]="[account]"></app-balance-widget>
      <app-account-summary [accounts]="[account]"></app-account-summary>

      <article class="detail-card">
        <p class="label">Description</p>
        <p>{{ account.description || 'No description provided.' }}</p>
      </article>
    </section>

    <ng-template #loading>
      <p>Loading account...</p>
    </ng-template>
  `,
})
export class AccountDetailsPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly accountsService = inject(AccountsService);
    private readonly destroyRef = inject(DestroyRef);

    account: Account | null = null;

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.accountsService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((account) => {
            this.account = account ?? null;
        });
    }

    goBack(): void {
        this.router.navigate(['/accounts']);
    }

    editAccount(): void {
        if (!this.account) return;
        this.router.navigate(['/accounts', this.account.id, 'edit']);
    }
}
