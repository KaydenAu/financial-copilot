import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { SavingsGoalsService } from '../../savings-goals.service';
import { SavingsGoal } from '../../savings-goal.model';
import { GoalCard } from '../../components/goal-card/goal-card';
import { GoalProgressBar } from '../../components/goal-progress-bar/goal-progress-bar';
import { StatisticsWidget } from '../../components/statistics-widget/statistics-widget';
import { ContributionForm } from '../../components/contribution-form/contribution-form';

@Component({
    selector: 'app-goal-list-page',
    standalone: true,
    imports: [CommonModule, GoalCard, GoalProgressBar, StatisticsWidget, ContributionForm],
    template: `
    <section class="page-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Savings goals</p>
          <h1>Savings goal dashboard</h1>
          <p>Track progress, deadlines, and contributions in one place.</p>
        </div>
        <button type="button" class="buttons"(click)="createGoal()">New goal</button>
      </header>

      <app-statistics-widget [goals]="filteredGoals"></app-statistics-widget>

      <label class="search">
        <span>Search goals</span>
        <input type="search" [value]="searchText" (input)="onSearch($event)" />
      </label>

      <div class="grid">
        <app-goal-card
          *ngFor="let goal of filteredGoals"
          [goal]="goal"
          (view)="viewGoal($event)"
          (edit)="editGoal($event)"
          (remove)="removeGoal($event)"
        ></app-goal-card>
      </div>

      <div class="grid">
        <app-goal-progress-bar *ngFor="let goal of filteredGoals" [goal]="goal"></app-goal-progress-bar>
      </div>

      <app-contribution-form (submitted)="recordContribution($event)"></app-contribution-form>
    </section>
  `,
    styleUrl: './goal-list-page.scss',
})
export class GoalListPage implements OnInit {
    private readonly goalsService = inject(SavingsGoalsService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    goals: SavingsGoal[] = [];
    filteredGoals: SavingsGoal[] = [];
    searchText = '';

    ngOnInit(): void {
        this.goalsService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((goals) => {
            this.goals = goals;
            this.applyFilters();
        });
    }

    onSearch(event: Event): void {
        this.searchText = (event.target as HTMLInputElement).value;
        this.applyFilters();
    }

    createGoal(): void {
        this.router.navigate(['/savings-goals/create']);
    }

    viewGoal(goal: SavingsGoal): void {
        this.router.navigate(['/savings-goals', goal.id]);
    }

    editGoal(goal: SavingsGoal): void {
        this.router.navigate(['/savings-goals', goal.id, 'edit']);
    }

    removeGoal(goal: SavingsGoal): void {
        if (!confirm(`Delete ${goal.title}?`)) {
            return;
        }

        this.goalsService.delete(goal.id).subscribe(() => this.applyFilters());
    }

    recordContribution(value: { amount: number; note?: string }): void {
        const goal = this.filteredGoals[0];
        if (!goal || !value.amount) return;
        this.goalsService.addContribution(goal.id, value.amount).subscribe();
    }

    private applyFilters(): void {
        const query = this.searchText.trim().toLowerCase();
        this.filteredGoals = this.goals.filter((goal) => {
            if (!query) {
                return true;
            }

            return [goal.title, goal.description ?? '']
                .join(' ')
                .toLowerCase()
                .includes(query);
        });
    }
}
