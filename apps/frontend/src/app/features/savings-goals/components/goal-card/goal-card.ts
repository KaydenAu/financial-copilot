import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SavingsGoal } from '../../savings-goal.model';

@Component({
    selector: 'app-goal-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <article class="card">
      <div>
        <p class="eyebrow">Savings goal</p>
        <h3>{{ goal.title }}</h3>
        <p *ngIf="goal.description">{{ goal.description }}</p>
      </div>
      <p>{{ goal.currentAmount | currency:'RM':'symbol':'1.2-2' }} of {{ goal.targetAmount | currency:'RM':'symbol':'1.2-2' }}</p>
      <div class="actions">
        <button type="button" (click)="view.emit(goal)">View</button>
        <button type="button" (click)="edit.emit(goal)">Edit</button>
        <button type="button" (click)="remove.emit(goal)">Delete</button>
      </div>
    </article>
  `,
    styleUrl: './goal-card.scss',
})
export class GoalCard {
    @Input({ required: true }) goal!: SavingsGoal;
    @Output() view = new EventEmitter<SavingsGoal>();
    @Output() edit = new EventEmitter<SavingsGoal>();
    @Output() remove = new EventEmitter<SavingsGoal>();
}
