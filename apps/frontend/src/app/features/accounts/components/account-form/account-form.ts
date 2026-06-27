import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account, AccountFormValue, ACCOUNT_TYPES } from '../../account.model';

@Component({
    selector: 'app-account-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <form class="form" [formGroup]="form" (ngSubmit)="submit()">
      <label>
        Name
        <input type="text" formControlName="name" />
      </label>
      <label>
        Type
        <select formControlName="type">
          <option *ngFor="let type of accountTypes" [value]="type">{{ type }}</option>
        </select>
      </label>
      <label>
        Balance
        <input type="number" formControlName="balance" />
      </label>
      <label>
        Currency
        <input type="text" formControlName="currency" />
      </label>
      <label class="full">
        Description
        <textarea rows="4" formControlName="description"></textarea>
      </label>
      <div class="actions full">
        <button type="button" (click)="reset.emit()">Cancel</button>
        <button type="submit">{{ submitLabel }}</button>
      </div>
    </form>
  `,
    styleUrl: './account-form.scss',
})
export class AccountForm implements OnChanges {
    private readonly fb = inject(FormBuilder);

    @Input() account: Account | null = null;
    @Input() submitLabel = 'Save account';
    @Output() submitted = new EventEmitter<AccountFormValue>();
    @Output() reset = new EventEmitter<void>();

    readonly accountTypes = ACCOUNT_TYPES;

    readonly form = this.fb.group({
        name: ['', Validators.required],
        type: ['Checking', Validators.required],
        balance: [0, Validators.required],
        currency: ['USD', Validators.required],
        description: [''],
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['account']) {
            this.form.reset({
                name: this.account?.name ?? '',
                type: this.account?.type ?? 'Checking',
                balance: this.account?.balance ?? 0,
                currency: this.account?.currency ?? 'USD',
                description: this.account?.description ?? '',
            });
        }
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        this.submitted.emit({
            name: value.name ?? '',
            type: value.type ?? 'Checking',
            balance: Number(value.balance ?? 0),
            currency: value.currency ?? 'USD',
            description: value.description ?? undefined,
        });
    }
}
