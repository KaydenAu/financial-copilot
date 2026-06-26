import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { BudgetsService } from '../../budgets.service';
import { Budget } from '../../budget.model';
import { BudgetCard } from '../../components/budget-card/budget-card';
import { BudgetChart } from '../../components/budget-chart/budget-chart';
import { BudgetProgress } from '../../components/budget-progress/budget-progress';

@Component({
    selector: 'app-budget-list-page',
    standalone: true,
    imports: [CommonModule, BudgetCard, BudgetChart, BudgetProgress],
    template: `
    <section class="page-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Budgets</p>
          <h1>Budget dashboard</h1>
          <p>Track spend by category and surface overspending early.</p>
        </div>
        <button type="button" (click)="createBudget()">New budget</button>
      </header>

      <label class="search">
        <span>Search budgets</span>
        <input type="search" [value]="searchText" (input)="onSearch($event)" />
      </label>

      <app-budget-chart [budgets]="filteredBudgets"></app-budget-chart>

      <div class="grid">
        <app-budget-card
          *ngFor="let budget of filteredBudgets"
          [budget]="budget"
          (view)="viewBudget($event)"
          (edit)="editBudget($event)"
          (remove)="removeBudget($event)"
        ></app-budget-card>
      </div>

      <div class="grid">
        <app-budget-progress *ngFor="let budget of filteredBudgets" [budget]="budget"></app-budget-progress>
      </div>
    </section>
  `,
    styleUrl: './budget-list-page.scss',
})
export class BudgetListPage implements OnInit {
    private readonly budgetsService = inject(BudgetsService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    budgets: Budget[] = [];
    filteredBudgets: Budget[] = [];
    searchText = '';

    ngOnInit(): void {
        this.budgetsService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((budgets) => {
            this.budgets = budgets;
            this.applyFilters();
        });
    }

    onSearch(event: Event): void {
        this.searchText = (event.target as HTMLInputElement).value;
        this.applyFilters();
    }

    createBudget(): void {
        this.router.navigate(['/budgets/create']);
    }

    viewBudget(budget: Budget): void {
        this.router.navigate(['/budgets', budget.id]);
    }

    editBudget(budget: Budget): void {
        this.router.navigate(['/budgets', budget.id, 'edit']);
    }

    removeBudget(budget: Budget): void {
        if (!confirm(`Delete ${budget.category}?`)) {
            return;
        }

        this.budgetsService.delete(budget.id).subscribe(() => this.applyFilters());
    }

    private applyFilters(): void {
        const query = this.searchText.trim().toLowerCase();
        this.filteredBudgets = this.budgets.filter((budget) => {
            if (!query) {
                return true;
            }

            return [budget.category, budget.period]
                .join(' ')
                .toLowerCase()
                .includes(query);
        });
    }
}
