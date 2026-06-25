import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CategoryOption {
    id: number;
    name: string;
}

export interface GenerateReportRequest {
    categoryId: number;
    startDate: string;
    endDate: string;
}

@Injectable({
    providedIn: 'root'
})

export class ReportService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiUrl;

    getParentCategories() {
        return this.http.get<CategoryOption[]>(
            `${this.baseUrl}/categories/parents`
        );
    }

    generateReport(payload: GenerateReportRequest) {
        return this.http.post<any>(
            `${this.baseUrl}/reports/generate`,
            payload
        );
    }

    downloadPdf(payload: any) {
        return this.http.post(
            `${this.baseUrl}/reports/export/pdf`,
            payload,
            {
                responseType: 'blob'
            }
        );
    }
}