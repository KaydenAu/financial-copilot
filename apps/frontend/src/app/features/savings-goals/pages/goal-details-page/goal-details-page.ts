import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { SavingsGoalsService } from '../../savings-goals.service';
import { SavingsGoal } from '../../savings-goal.model';
import { GoalProgressBar } from '../../components/goal-progress-bar/goal-progress-bar';
import { StatisticsWidget } from '../../components/statistics-widget/statistics-widget';
import { ContributionForm } from '../../components/contribution-form/contribution-form';

@Component({
    selector: 'app-goal-details-page',
    standalone: true,
    imports: [CommonModule, GoalProgressBar, StatisticsWidget, ContributionForm],
    template: `
    <section class="page-shell" *ngIf="goal; else loading">
      <header class="hero">
        <div>
          <p class="eyebrow">Goal details</p>
          <h1>{{ goal.title }}</h1>
          <p>Deadline {{ goal.deadline | date:'mediumDate' }}</p>
        </div>
        <div class="actions">
          <button type="button" (click)="goBack()">Back</button>
          <button type="button" (click)="editGoal()">Edit</button>
        </div>
      </header>

      <app-goal-progress-bar [goal]="goal"></app-goal-progress-bar>
      <app-statistics-widget [goals]="[goal]"></app-statistics-widget>
      <app-contribution-form (submitted)="addContribution($event)"></app-contribution-form>
    </section>

    <ng-template #loading>
      <p>Loading savings goal...</p>
    </ng-template>
  `,
})
export class GoalDetailsPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly goalsService = inject(SavingsGoalsService);
    private readonly destroyRef = inject(DestroyRef);

    goal: SavingsGoal | null = null;

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.goalsService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((goal) => {
            this.goal = goal ?? null;
        });
    }

    goBack(): void {
        this.router.navigate(['/savings-goals']);
    }

    editGoal(): void {
        if (!this.goal) return;
        this.router.navigate(['/savings-goals', this.goal.id, 'edit']);
    }

    addContribution(value: { amount: number; note?: string }): void {
        if (!this.goal || !value.amount) return;
        this.goalsService.addContribution(this.goal.id, value.amount).subscribe((updated) => {
            this.goal = updated;
        });
    }
}
