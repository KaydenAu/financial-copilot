import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Budget } from '../../budget.model';

@Component({
    selector: 'app-budget-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <article class="card" [class.warning]="budget.spent > budget.limit">
      <div>
        <p class="eyebrow">{{ budget.period }}</p>
        <h3>{{ budget.category }}</h3>
      </div>
      <p>{{ budget.spent | currency:'USD':'symbol':'1.2-2' }} of {{ budget.limit | currency:'USD':'symbol':'1.2-2' }}</p>
      <div class="actions">
        <button type="button" (click)="view.emit(budget)">View</button>
        <button type="button" (click)="edit.emit(budget)">Edit</button>
        <button type="button" (click)="remove.emit(budget)">Delete</button>
      </div>
    </article>
  `,
    styleUrl: './budget-card.scss',
})
export class BudgetCard {
    @Input({ required: true }) budget!: Budget;
    @Output() view = new EventEmitter<Budget>();
    @Output() edit = new EventEmitter<Budget>();
    @Output() remove = new EventEmitter<Budget>();
}
