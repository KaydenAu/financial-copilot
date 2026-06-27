import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-contribution-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <form class="form" [formGroup]="form" (ngSubmit)="submit()">
      <label class="full">
        Contribution amount
        <input type="number" formControlName="amount" />
      </label>
      <label class="full">
        Note
        <textarea rows="3" formControlName="note"></textarea>
      </label>
      <div class="actions full">
        <button type="button" (click)="reset.emit()">Cancel</button>
        <button type="submit">Add contribution</button>
      </div>
    </form>
  `,
    styleUrl: './contribution-form.scss',
})
export class ContributionForm {
    private readonly fb = inject(FormBuilder);

    @Output() submitted = new EventEmitter<{ amount: number; note?: string }>();
    @Output() reset = new EventEmitter<void>();

    readonly form = this.fb.group({
        amount: [0, Validators.required],
        note: [''],
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        this.submitted.emit({ amount: Number(value.amount ?? 0), note: value.note ?? undefined });
    }
}
