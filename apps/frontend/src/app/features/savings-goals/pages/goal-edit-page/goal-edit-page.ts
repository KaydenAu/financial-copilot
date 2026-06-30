import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SavingsGoalsService } from '../../savings-goals.service';
import { SavingsGoal, SavingsGoalFormValue } from '../../savings-goal.model';

@Component({
    selector: 'app-goal-edit-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <section class="page-shell" *ngIf="goal; else loading">
      <header class="hero">
        <div>
          <p class="eyebrow">Savings goals</p>
          <h1>Edit goal</h1>
        </div>
        <button type="button" (click)="goBack()">Back</button>
      </header>

      <form class="form" [formGroup]="form" (ngSubmit)="updateGoal()">
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
          <button type="submit">Save changes</button>
        </div>
      </form>
    </section>

    <ng-template #loading>
      <p>Loading savings goal...</p>
    </ng-template>
  `,
})
export class GoalEditPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly goalsService = inject(SavingsGoalsService);
    private readonly destroyRef = inject(DestroyRef);

    goal: SavingsGoal | null = null;

    readonly form = this.fb.group({
        title: ['', Validators.required],
        targetAmount: [0, Validators.required],
        currentAmount: [0, Validators.required],
        deadline: ['', Validators.required],
        description: [''],
    });

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.goalsService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((goal) => {
            this.goal = goal ?? null;
            if (goal) {
                this.form.reset({
                    title: goal.title,
                    targetAmount: goal.targetAmount,
                    currentAmount: goal.currentAmount,
                    deadline: goal.deadline.toISOString().slice(0, 10),
                    description: goal.description ?? '',
                });
            }
        });
    }

    updateGoal(): void {
        if (this.form.invalid || !this.goal) {
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

        this.goalsService.update(this.goal.id, payload).subscribe((updated) => {
            this.router.navigate(['/savings-goals', updated.id]);
        });
    }

    goBack(): void {
        this.router.navigate(['/savings-goals']);
    }
}
