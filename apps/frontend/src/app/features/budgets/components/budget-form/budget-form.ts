import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Budget, BudgetFormValue, BUDGET_PERIODS } from '../../budget.model';

@Component({
    selector: 'app-budget-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <form class="form" [formGroup]="form" (ngSubmit)="submit()">
      <label>
        Category
        <input type="text" formControlName="category" />
      </label>
      <label>
        Period
        <select formControlName="period">
          <option *ngFor="let period of periods" [value]="period">{{ period }}</option>
        </select>
      </label>
      <label>
        Limit
        <input type="number" formControlName="limit" />
      </label>
      <label>
        Spent
        <input type="number" formControlName="spent" />
      </label>
      <label>
        Start Date
        <input type="date" formControlName="startDate" />
      </label>
      <label>
        End Date
        <input type="date" formControlName="endDate" />
      </label>
      <div class="actions full">
        <button type="button" (click)="reset.emit()">Cancel</button>
        <button type="submit">{{ submitLabel }}</button>
      </div>
    </form>
  `,
    styleUrl: './budget-form.scss',
})
export class BudgetForm implements OnChanges {
    private readonly fb = inject(FormBuilder);

    @Input() budget: Budget | null = null;
    @Input() submitLabel = 'Save budget';
    @Output() submitted = new EventEmitter<BudgetFormValue>();
    @Output() reset = new EventEmitter<void>();

    readonly periods = BUDGET_PERIODS;

    readonly form = this.fb.group({
        category: ['', Validators.required],
        limit: [0, Validators.required],
        spent: [0, Validators.required],
        period: ['Monthly', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['budget']) {
            this.form.reset({
                category: this.budget?.category ?? '',
                limit: this.budget?.limit ?? 0,
                spent: this.budget?.spent ?? 0,
                period: this.budget?.period ?? 'Monthly',
                startDate: this.formatDate(this.budget?.startDate),
                endDate: this.formatDate(this.budget?.endDate),
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
            category: value.category ?? '',
            limit: Number(value.limit ?? 0),
            spent: Number(value.spent ?? 0),
            period: value.period ?? 'Monthly',
            startDate: value.startDate ? new Date(value.startDate) : new Date(),
            endDate: value.endDate ? new Date(value.endDate) : new Date(),
        });
    }

    private formatDate(value?: Date): string {
        return value ? value.toISOString().slice(0, 10) : '';
    }
}
