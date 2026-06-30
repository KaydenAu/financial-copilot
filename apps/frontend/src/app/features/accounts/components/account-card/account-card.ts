import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../../account.model';

@Component({
    selector: 'app-account-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <article class="card">
      <div>
        <p class="eyebrow">{{ account.type }}</p>
        <h3 class="name">{{ account.name }}</h3>
        <p class="description" *ngIf="account.description">{{ account.description }}</p>
      </div>
      <strong class="balance">{{ account.balance | currency: account.currency:'symbol':'1.2-2' }}</strong>
      <div class="actions">
        <button type="button" class="buttons" (click)="view.emit(account)">View</button>
        <button type="button" class="buttons" (click)="edit.emit(account)">Edit</button>
        <button type="button" class="buttons" (click)="remove.emit(account)">Delete</button>
      </div>
    </article>
  `,
    styleUrl: './account-card.scss',
})
export class AccountCard {
    @Input({ required: true }) account!: Account;
    @Output() view = new EventEmitter<Account>();
    @Output() edit = new EventEmitter<Account>();
    @Output() remove = new EventEmitter<Account>();
}
