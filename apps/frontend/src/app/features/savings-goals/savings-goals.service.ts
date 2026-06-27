import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, throwError } from 'rxjs';
import { MOCK_SAVINGS_GOALS, SavingsGoal, SavingsGoalFormValue } from './savings-goal.model';

@Injectable({ providedIn: 'root' })
export class SavingsGoalsService {
    private readonly store = new BehaviorSubject<SavingsGoal[]>(MOCK_SAVINGS_GOALS);

    readonly goals$ = this.store.asObservable();

    getAll(): Observable<SavingsGoal[]> {
        return this.goals$;
    }

    getById(id: number): Observable<SavingsGoal | undefined> {
        return this.goals$.pipe(map((goals) => goals.find((goal) => goal.id === id)));
    }

    create(payload: SavingsGoalFormValue): Observable<SavingsGoal> {
        const goal: SavingsGoal = { id: Date.now(), ...payload };
        this.store.next([...this.store.value, goal]);
        return of(goal);
    }

    update(id: number, payload: SavingsGoalFormValue): Observable<SavingsGoal> {
        const current = this.store.value;
        const index = current.findIndex((goal) => goal.id === id);
        if (index < 0) return throwError(() => new Error('Savings goal not found'));

        const updated = { ...current[index], ...payload };
        const next = [...current];
        next[index] = updated;
        this.store.next(next);
        return of(updated);
    }

    addContribution(id: number, amount: number): Observable<SavingsGoal> {
        const current = this.store.value;
        const index = current.findIndex((goal) => goal.id === id);
        if (index < 0) return throwError(() => new Error('Savings goal not found'));

        const updated = { ...current[index], currentAmount: current[index].currentAmount + amount };
        const next = [...current];
        next[index] = updated;
        this.store.next(next);
        return of(updated);
    }

    delete(id: number): Observable<void> {
        this.store.next(this.store.value.filter((goal) => goal.id !== id));
        return of(void 0);
    }
}
