import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModules } from '../../../../shared/shared.module';
import { ReportService, GenerateReportRequest } from '../report.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface SelectOption {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-report-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    ...SharedModules
  ],
  templateUrl: './report-form-dialog.html',
  styleUrl: './report-form-dialog.scss',
})

export class ReportFormDialog implements OnInit {
  readonly data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ReportFormDialog>);
  private reportService = inject(ReportService);
  private cdr = inject(ChangeDetectorRef);

  // UI STATE
  reportTitle = this.data?.reportType ?? 'Report';
  loading = false;
  reportResult: any = null;

  // FORM STATE
  selectedCategoryId = new FormControl<number | null>(null);
  selectedDateRange: string = 'last30days';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  categories: SelectOption[] = [];

  dateRanges = [
    { value: 'last30days', viewValue: 'Last 30 Days' },
    { value: 'thisMonth', viewValue: 'This Month' },
    { value: 'thisYear', viewValue: 'This Year' },
    { value: 'custom', viewValue: 'Custom Range' }
  ];

  ngOnInit(): void {
    this.loadParentCategories();
  }

  // LOAD CATEGORIES
  loadParentCategories() {
    this.reportService.getParentCategories().subscribe({
      next: (res) => {
        this.categories = res.map(c => ({
          value: c.id,
          viewValue: c.name
        }));
        this.cdr.detectChanges();
      }
    });
  }

  // DATE RANGE CHANGE
  onDateRangeChange(value: string) {
    this.selectedDateRange = value;
    if (value === 'custom') {
      this.dateFrom = null;
      this.dateTo = null;
    }
    this.cdr.detectChanges();
  }

  // CLOSE
  closeDialog() {
    this.dialogRef.close();
  }

  // MAIN GENERATE
  generateReport() {
    if (!this.selectedCategoryId.value) {
      return;
    }

    this.loading = true;
    this.reportResult = null;
    this.cdr.detectChanges();

    const payload: GenerateReportRequest = {
      categoryId: this.selectedCategoryId.value,
      startDate: this.getStartDate(),
      endDate: this.getEndDate()
    };

    this.reportService.generateReport(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.reportResult = {
          summary: res.summary,
          insights: res.insights ?? [],
          highlights: res.highlights ?? [],
          total: res.total
        };
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // SAFE PARSER
  safeParse(res: any) {
    try {
      if (typeof res === 'string') {
        return JSON.parse(res);
      }
      return res;
    } catch {
      return {
        summary: 'Invalid response',
        insights: [],
        highlights: []
      };
    }
  }

  // DATE HELPERS
  getStartDate(): string {
    if (this.selectedDateRange === 'custom' && this.dateFrom) {
      return this.dateFrom.toISOString();
    }

    const now = new Date();
    switch (this.selectedDateRange) {
      case 'last30days':
        now.setDate(now.getDate() - 30);
        break;
      case 'thisMonth':
        now.setDate(1);
        break;
      case 'thisYear':
        now.setMonth(0, 1);
        break;
    }
    return now.toISOString();
  }

  getEndDate(): string {
    if (this.selectedDateRange === 'custom' && this.dateTo) {
      return this.dateTo.toISOString();
    }
    return new Date().toISOString();
  }

  // DOWNLOAD
  downloadPDF() {
    this.loading = true;
    this.reportService.downloadPdf({
      report: this.reportResult,
      total: this.reportResult.total
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}