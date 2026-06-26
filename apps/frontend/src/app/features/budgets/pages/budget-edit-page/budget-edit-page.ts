import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { BudgetForm } from '../../components/budget-form/budget-form';
import { BudgetsService } from '../../budgets.service';
import { Budget, BudgetFormValue } from '../../budget.model';

@Component({
    selector: 'app-budget-edit-page',
    standalone: true,
    imports: [CommonModule, BudgetForm],
    template: `
    <section class="page-shell" *ngIf="budget; else loading">
      <header class="hero">
        <div>
          <p class="eyebrow">Budgets</p>
          <h1>Edit budget</h1>
        </div>
        <button type="button" (click)="goBack()">Back</button>
      </header>

      <app-budget-form [budget]="budget" submitLabel="Save changes" (submitted)="updateBudget($event)" (reset)="goBack()"></app-budget-form>
    </section>

    <ng-template #loading>
      <p>Loading budget...</p>
    </ng-template>
  `,
})
export class BudgetEditPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly budgetsService = inject(BudgetsService);
    private readonly destroyRef = inject(DestroyRef);

    budget: Budget | null = null;

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.budgetsService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((budget) => {
            this.budget = budget ?? null;
        });
    }

    updateBudget(payload: BudgetFormValue): void {
        if (!this.budget) return;
        this.budgetsService.update(this.budget.id, payload).subscribe((updated) => {
            this.router.navigate(['/budgets', updated.id]);
        });
    }

    goBack(): void {
        this.router.navigate(['/budgets']);
    }
}
