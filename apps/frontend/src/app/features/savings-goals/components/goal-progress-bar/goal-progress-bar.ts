import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SavingsGoal } from '../../savings-goal.model';

@Component({
    selector: 'app-goal-progress-bar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <article class="card">
      <p class="eyebrow">Progress</p>
      <h3>{{ goal.title }}</h3>
      <p>{{ completion | number:'1.0-0' }}% complete</p>
      <progress [value]="progressValue" max="100"></progress>
    </article>
  `,
    styleUrl: './goal-progress-bar.scss',
})
export class GoalProgressBar {
    @Input({ required: true }) goal!: SavingsGoal;

    get completion(): number {
        return this.goal.targetAmount ? (this.goal.currentAmount / this.goal.targetAmount) * 100 : 0;
    }

    get progressValue(): number {
        return Math.min(100, this.completion);
    }
}
