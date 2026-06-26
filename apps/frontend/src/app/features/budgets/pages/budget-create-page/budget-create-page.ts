import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetForm } from '../../components/budget-form/budget-form';
import { BudgetsService } from '../../budgets.service';
import { BudgetFormValue } from '../../budget.model';

@Component({
    selector: 'app-budget-create-page',
    standalone: true,
    imports: [BudgetForm],
    template: `
    <section class="page-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Budgets</p>
          <h1>Create budget</h1>
        </div>
        <button type="button" (click)="goBack()">Back</button>
      </header>

      <app-budget-form submitLabel="Create budget" (submitted)="createBudget($event)" (reset)="goBack()"></app-budget-form>
    </section>
  `,
})
export class BudgetCreatePage {
    private readonly budgetsService = inject(BudgetsService);
    private readonly router = inject(Router);

    createBudget(payload: BudgetFormValue): void {
        this.budgetsService.create(payload).subscribe((budget) => {
            this.router.navigate(['/budgets', budget.id]);
        });
    }

    goBack(): void {
        this.router.navigate(['/budgets']);
    }
}
