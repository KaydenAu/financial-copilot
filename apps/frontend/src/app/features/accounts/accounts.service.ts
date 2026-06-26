import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, throwError } from 'rxjs';
import { Account, AccountFormValue, MOCK_ACCOUNTS } from './account.model';

@Injectable({ providedIn: 'root' })
export class AccountsService {
    private readonly store = new BehaviorSubject<Account[]>(MOCK_ACCOUNTS);

    readonly accounts$ = this.store.asObservable();

    getAll(): Observable<Account[]> {
        return this.accounts$;
    }

    getById(id: number): Observable<Account | undefined> {
        return this.accounts$.pipe(map((accounts) => accounts.find((account) => account.id === id)));
    }

    create(payload: AccountFormValue): Observable<Account> {
        const account: Account = {
            id: Date.now(),
            createdAt: new Date(),
            ...payload,
        };
        this.store.next([...this.store.value, account]);
        return of(account);
    }

    update(id: number, payload: AccountFormValue): Observable<Account> {
        const current = this.store.value;
        const index = current.findIndex((account) => account.id === id);
        if (index < 0) {
            return throwError(() => new Error('Account not found'));
        }

        const updated = { ...current[index], ...payload };
        const next = [...current];
        next[index] = updated;
        this.store.next(next);
        return of(updated);
    }

    delete(id: number): Observable<void> {
        this.store.next(this.store.value.filter((account) => account.id !== id));
        return of(void 0);
    }
}
