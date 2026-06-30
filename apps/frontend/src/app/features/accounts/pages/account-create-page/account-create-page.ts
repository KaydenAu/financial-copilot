import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountForm } from '../../components/account-form/account-form';
import { AccountsService } from '../../accounts.service';
import { AccountFormValue } from '../../account.model';

@Component({
    selector: 'app-account-create-page',
    standalone: true,
    imports: [AccountForm],
    template: `
    <section class="page-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Accounts</p>
          <h1>Create account</h1>
        </div>
        <button type="button" (click)="goBack()">Back</button>
      </header>

      <app-account-form submitLabel="Create account" (submitted)="createAccount($event)" (reset)="goBack()"></app-account-form>
    </section>
  `,
})
export class AccountCreatePage {
    private readonly accountsService = inject(AccountsService);
    private readonly router = inject(Router);

    createAccount(payload: AccountFormValue): void {
        this.accountsService.create(payload).subscribe((account) => {
            this.router.navigate(['/accounts', account.id]);
        });
    }

    goBack(): void {
        this.router.navigate(['/accounts']);
    }
}
