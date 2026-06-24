import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
    private baseUrl = `${environment.apiUrl}/transactions`;
    private baseUrl2 = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<any> {
        return this.http.get(this.baseUrl);
    }

    getCategories() {
        return this.http.get<any[]>(this.baseUrl2);
    }

    create(payload: any): Observable<any> {
        return this.http.post(this.baseUrl, payload);
    }

    update(id: number, payload: any): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${id}`, payload);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}