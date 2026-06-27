import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SavingsGoalsService } from '../../savings-goals.service';
import { SavingsGoalFormValue } from '../../savings-goal.model';

@Component({
    selector: 'app-goal-create-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <section class="page-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Savings goals</p>
          <h1>Create goal</h1>
        </div>
        <button type="button" (click)="goBack()">Back</button>
      </header>

      <form class="form" [formGroup]="form" (ngSubmit)="createGoal()">
        <label>
          Title
          <input type="text" formControlName="title" />
        </label>
        <label>
          Target Amount
          <input type="number" formControlName="targetAmount" />
        </label>
        <label>
          Current Amount
          <input type="number" formControlName="currentAmount" />
        </label>
        <label>
          Deadline
          <input type="date" formControlName="deadline" />
        </label>
        <label class="full">
          Description
          <textarea rows="4" formControlName="description"></textarea>
        </label>
        <div class="actions full">
          <button type="button" (click)="goBack()">Cancel</button>
          <button type="submit">Create goal</button>
        </div>
      </form>
    </section>
  `,
})
export class GoalCreatePage {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly goalsService = inject(SavingsGoalsService);

    readonly form = this.fb.group({
        title: ['', Validators.required],
        targetAmount: [0, Validators.required],
        currentAmount: [0, Validators.required],
        deadline: ['', Validators.required],
        description: [''],
    });

    createGoal(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        const payload: SavingsGoalFormValue = {
            title: value.title ?? '',
            targetAmount: Number(value.targetAmount ?? 0),
            currentAmount: Number(value.currentAmount ?? 0),
            deadline: value.deadline ? new Date(value.deadline) : new Date(),
            description: value.description ?? undefined,
        };

        this.goalsService.create(payload).subscribe((goal) => {
            this.router.navigate(['/savings-goals', goal.id]);
        });
    }

    goBack(): void {
        this.router.navigate(['/savings-goals']);
    }
}
