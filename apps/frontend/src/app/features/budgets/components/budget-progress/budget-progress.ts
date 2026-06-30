import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Budget } from '../../budget.model';

@Component({
    selector: 'app-budget-progress',
    standalone: true,
    imports: [CommonModule],
    template: `
    <article class="card">
      <p class="eyebrow">Budget progress</p>
      <h3>{{ budget.category }}</h3>
      <p>{{ completion | number:'1.0-0' }}% used</p>
      <progress [value]="progressValue" max="100"></progress>
    </article>
  `,
    styleUrl: './budget-progress.scss',
})
export class BudgetProgress {
    @Input({ required: true }) budget!: Budget;

    get completion(): number {
        return this.budget.limit ? (this.budget.spent / this.budget.limit) * 100 : 0;
    }

    get progressValue(): number {
        return Math.min(100, this.completion);
    }
}
