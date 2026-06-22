import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { SharedModules } from '../../../../shared/shared.module';

interface SelectOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-report-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ...SharedModules
  ],
  templateUrl: './report-form-dialog.html',
  styleUrl: './report-form-dialog.scss',
})

export class ReportFormDialog {

  readonly data = inject(MAT_DIALOG_DATA);

  private readonly dialogRef =
    inject(MatDialogRef<ReportFormDialog>);

  private readonly fb =
    inject(FormBuilder);

  reportTitle = this.data?.reportType ?? 'Report';

  selectedDateRange = '';

  formSubmitted = false;

  get hasSelectedExportFormat(): boolean {
    const value = this.exportFormat.value;

    return Boolean(value?.pdf || value?.excel || value?.csv);
  }

  validateExportFormat(): boolean {
    const value = this.exportFormat.value;

    return !!(value.pdf || value.excel || value.csv);
  }

  dateRanges: SelectOption[] = [
    { value: 'last30days', viewValue: 'Last 30 Days' },
    { value: 'thisMonth', viewValue: 'This Month' },
    { value: 'lastMonth', viewValue: 'Last Month' },
    { value: 'thisQuarter', viewValue: 'This Quarter' },
    { value: 'thisYear', viewValue: 'This Year' },
    { value: 'custom', viewValue: 'Custom Range' }
  ];

  accounts: SelectOption[] = [
    { value: 'all', viewValue: 'All Accounts' },
    { value: 'checking', viewValue: 'Checking Account' },
    { value: 'savings', viewValue: 'Savings Account' }
  ];

  categories: SelectOption[] = [
    { value: 'all', viewValue: 'All Categories' },
    { value: 'income', viewValue: 'Income' },
    { value: 'food', viewValue: 'Food & Dining' },
    { value: 'transport', viewValue: 'Transportation' }
  ];

  groupByOptions: SelectOption[] = [
    { value: 'none', viewValue: 'None' },
    { value: 'category', viewValue: 'Category' },
    { value: 'account', viewValue: 'Account' },
    { value: 'month', viewValue: 'Month' }
  ];

  readonly reportSections = this.fb.group({
    summary: true,
    charts: true,
    transactions: true,
    categoryBreakdown: true,
    accountBalances: false,
    notes: false,
  });

  readonly exportFormat = this.fb.group({
    pdf: [true],
    excel: [false],
    csv: [false],
  });

  closeDialog(): void {
    this.dialogRef.close();
  }

  generateReport(): void {
    this.formSubmitted = true;

    if (!this.validateExportFormat()) {
      return;
    }

    console.log('Generate Report', {
      reportType: this.reportTitle,
      exportFormat: this.exportFormat.value,
      reportSections: this.reportSections.value
    });

    this.dialogRef.close();
  }
}