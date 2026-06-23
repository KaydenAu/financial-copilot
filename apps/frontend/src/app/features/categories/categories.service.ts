import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
    id: number;
    name: string;
    description?: string | null;
    parentId?: number | null;
    children?: Category[];
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root',
})

export class CategoriesService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/categories`;

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }

    createCategory(payload: any): Observable<Category> {
        return this.http.post<Category>(this.apiUrl, payload);
    }

    updateCategory(id: number, payload: any): Observable<Category> {
        return this.http.patch<Category>(`${this.apiUrl}/${id}`, payload);
    }

    deleteCategory(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}