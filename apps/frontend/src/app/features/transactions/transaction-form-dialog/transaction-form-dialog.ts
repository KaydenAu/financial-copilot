import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TransactionsService } from '../transactions.service';

@Component({
  selector: 'app-transaction-form-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './transaction-form-dialog.html',
  styleUrl: './transaction-form-dialog.scss',
})
export class TransactionFormDialog implements OnInit {

  categories: any[] = [];
  subcategories: any[] = [];

  form = {
    categoryId: null as number | null,
    subcategoryId: null as number | null,
    transactionDate: new Date(),
    account: '',
    currency: 'MYR',
    amount: null as number | null,
    description: '',
  };

  constructor(
    private dialogRef: MatDialogRef<TransactionFormDialog>,
    private transactionApi: TransactionsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.mode === 'edit' && data?.transaction) {
      this.form = {
        categoryId: data.transaction.categoryId,
        subcategoryId: data.transaction.subcategoryId,
        transactionDate: new Date(data.transaction.transactionDate),
        account: data.transaction.account,
        currency: data.transaction.currency,
        amount: data.transaction.amount,
        description: data.transaction.description,
      };
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.transactionApi.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  onCategoryChange(): void {
    const selected = this.categories.find(
      c => c.id === this.form.categoryId
    );

    this.subcategories = selected?.children || [];
    this.form.subcategoryId = null;
  }

  get dialogTitle(): string {
    return this.data.mode === 'edit'
      ? 'Edit Transaction'
      : 'Add Transaction';
  }

  save(): void {
    const payload = {
      categoryId: this.form.categoryId,
      subcategoryId: this.form.subcategoryId,
      transactionDate: this.form.transactionDate,
      account: this.form.account,
      currency: this.form.currency,
      amount: this.form.amount,
      description: this.form.description,
    };

    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}