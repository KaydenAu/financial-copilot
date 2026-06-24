import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SharedModules } from '../../../../shared/shared.module';

@Component({
  selector: 'app-transaction-form-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ...SharedModules,
    MatDatepickerModule
  ],
  templateUrl: './transaction-form-dialog.html',
  styleUrl: './transaction-form-dialog.scss',
})

export class TransactionFormDialog {
  categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Salary',
  ];

  subcategories = [
    'Restaurant',
    'Fuel',
    'Electronics',
    'Utilities',
    'Monthly Income',
  ];

  accounts = [
    'Cash',
    'Maybank',
    'CIMB',
    'Credit Card',
  ];

  currencies = [
    'MYR',
    'USD',
    'SGD',
  ];

  form = {
    category: '',
    subcategory: '',
    date: new Date(),
    account: '',
    currency: 'MYR',
    amount: null as number | null,
    description: '',
  };

  constructor(
    private dialogRef: MatDialogRef<TransactionFormDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    if (
      data?.mode === 'edit' &&
      data?.transaction
    ) {
      this.form = {
        ...data.transaction,
        date: new Date(data.transaction.date),
      };
    }
  }

  get dialogTitle(): string {
    return this.data.mode === 'edit'
      ? 'Edit Transaction'
      : 'Add Transaction';
  }

  save(): void {
    console.log(this.form);
    this.dialogRef.close(this.form);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}