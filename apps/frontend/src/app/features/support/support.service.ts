import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SupportRequest {
    name: string;
    email: string;
    category: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})

export class SupportService {
    private baseUrl = `${environment.apiUrl}/support`;

    constructor(private http: HttpClient) { }

    createTicket(data: SupportRequest): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }
}