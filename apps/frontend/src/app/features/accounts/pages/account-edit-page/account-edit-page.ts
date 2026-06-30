import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AccountForm } from '../../components/account-form/account-form';
import { AccountsService } from '../../accounts.service';
import { Account, AccountFormValue } from '../../account.model';

@Component({
    selector: 'app-account-edit-page',
    standalone: true,
    imports: [CommonModule, AccountForm],
    template: `
    <section class="page-shell" *ngIf="account; else loading">
      <header class="hero">
        <div>
          <p class="eyebrow">Accounts</p>
          <h1>Edit account</h1>
        </div>
        <button type="button" (click)="goBack()">Back</button>
      </header>

      <app-account-form [account]="account" submitLabel="Save changes" (submitted)="updateAccount($event)" (reset)="goBack()"></app-account-form>
    </section>

    <ng-template #loading>
      <p>Loading account...</p>
    </ng-template>
  `,
})
export class AccountEditPage implements OnInit {
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

    updateAccount(payload: AccountFormValue): void {
        if (!this.account) return;
        this.accountsService.update(this.account.id, payload).subscribe((updated) => {
            this.router.navigate(['/accounts', updated.id]);
        });
    }

    goBack(): void {
        this.router.navigate(['/accounts']);
    }
}
