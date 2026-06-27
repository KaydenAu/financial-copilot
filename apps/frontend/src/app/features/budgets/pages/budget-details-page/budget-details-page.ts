import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { BudgetsService } from '../../budgets.service';
import { Budget } from '../../budget.model';
import { BudgetChart } from '../../components/budget-chart/budget-chart';
import { BudgetProgress } from '../../components/budget-progress/budget-progress';

@Component({
    selector: 'app-budget-details-page',
    standalone: true,
    imports: [CommonModule, BudgetChart, BudgetProgress],
    template: `
    <section class="page-shell" *ngIf="budget; else loading">
      <header class="hero">
        <div>
          <p class="eyebrow">Budget details</p>
          <h1>{{ budget.category }}</h1>
          <p>{{ budget.period }} budget</p>
        </div>
        <div class="actions">
          <button type="button" (click)="goBack()">Back</button>
          <button type="button" (click)="editBudget()">Edit</button>
        </div>
      </header>

      <app-budget-progress [budget]="budget"></app-budget-progress>
      <app-budget-chart [budgets]="[budget]"></app-budget-chart>

      <article class="detail-card">
        <p class="label">Period</p>
        <p>{{ budget.startDate | date:'mediumDate' }} - {{ budget.endDate | date:'mediumDate' }}</p>
      </article>
    </section>

    <ng-template #loading>
      <p>Loading budget...</p>
    </ng-template>
  `,
})
export class BudgetDetailsPage implements OnInit {
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

    goBack(): void {
        this.router.navigate(['/budgets']);
    }

    editBudget(): void {
        if (!this.budget) return;
        this.router.navigate(['/budgets', this.budget.id, 'edit']);
    }
}
