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
        <h3>{{ account.name }}</h3>
        <p *ngIf="account.description">{{ account.description }}</p>
      </div>
      <strong>{{ account.balance | currency: account.currency:'symbol':'1.2-2' }}</strong>
      <div class="actions">
        <button type="button" (click)="view.emit(account)">View</button>
        <button type="button" (click)="edit.emit(account)">Edit</button>
        <button type="button" (click)="remove.emit(account)">Delete</button>
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
