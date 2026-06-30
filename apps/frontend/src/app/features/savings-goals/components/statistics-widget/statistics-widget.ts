import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SavingsGoal } from '../../savings-goal.model';

@Component({
    selector: 'app-statistics-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="summary-grid">
      <article class="summary-card">
        <p>Total target</p>
        <h2>{{ totalTarget | currency:'RM':'symbol':'1.2-2' }}</h2>
      </article>
      <article class="summary-card">
        <p>Current saved</p>
        <h2>{{ totalCurrent | currency:'RM':'symbol':'1.2-2' }}</h2>
      </article>
      <article class="summary-card">
        <p>Completion</p>
        <h2>{{ completionRate | number:'1.0-0' }}%</h2>
      </article>
      <article class="summary-card">
        <p>Due soon</p>
        <h2>{{ dueSoon }}</h2>
      </article>
    </section>
  `,
    styleUrl: './statistics-widget.scss',
})
export class StatisticsWidget {
    @Input() goals: SavingsGoal[] = [];

    get totalTarget(): number {
        return this.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    }

    get totalCurrent(): number {
        return this.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    }

    get completionRate(): number {
        return this.totalTarget ? (this.totalCurrent / this.totalTarget) * 100 : 0;
    }

    get dueSoon(): number {
        return this.goals.filter((goal) => goal.deadline.getTime() <= Date.now() + 1000 * 60 * 60 * 24 * 90).length;
    }
}
