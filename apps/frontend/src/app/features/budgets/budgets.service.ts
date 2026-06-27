import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, throwError } from 'rxjs';
import { Budget, BudgetFormValue, MOCK_BUDGETS } from './budget.model';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
    private readonly store = new BehaviorSubject<Budget[]>(MOCK_BUDGETS);

    readonly budgets$ = this.store.asObservable();

    getAll(): Observable<Budget[]> {
        return this.budgets$;
    }

    getById(id: number): Observable<Budget | undefined> {
        return this.budgets$.pipe(map((budgets) => budgets.find((budget) => budget.id === id)));
    }

    create(payload: BudgetFormValue): Observable<Budget> {
        const budget: Budget = { id: Date.now(), ...payload };
        this.store.next([...this.store.value, budget]);
        return of(budget);
    }

    update(id: number, payload: BudgetFormValue): Observable<Budget> {
        const current = this.store.value;
        const index = current.findIndex((budget) => budget.id === id);
        if (index < 0) return throwError(() => new Error('Budget not found'));

        const updated = { ...current[index], ...payload };
        const next = [...current];
        next[index] = updated;
        this.store.next(next);
        return of(updated);
    }

    delete(id: number): Observable<void> {
        this.store.next(this.store.value.filter((budget) => budget.id !== id));
        return of(void 0);
    }
}
