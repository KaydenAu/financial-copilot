import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModules } from '../../../../shared/shared.module';
import { TransactionTable } from '../transaction-table/transaction-table';
import { TransactionFormDialog } from '../transaction-form-dialog/transaction-form-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-page',
  standalone: true,
  imports: [
    ...SharedModules,
    MatMenuModule,
    TransactionTable
  ],
  templateUrl: './transaction-page.html',
  styleUrl: './transaction-page.scss',
})

export class TransactionPage {
  searchKeyword = '';

  constructor(
    private dialog: MatDialog
  ) { }

  categories = [
    'Food',
    'Transport',
    'Shopping',
    'Entertainment',
    'Bills',
    'Salary',
  ];

  selectedCategories: string[] = [];

  displayedColumns = [
    'category',
    'subcategory',
    'date',
    'account',
    'currency',
    'amount',
    'description',
    'action',
  ];

  visibleColumns: Record<string, boolean> = {
    category: true,
    subcategory: true,
    date: true,
    account: true,
    currency: true,
    amount: true,
    description: true,
    action: true,
  };

  transactions = [
    {
      category: 'Food',
      subcategory: 'Restaurant',
      date: '2026-06-22',
      account: 'Cash',
      currency: 'MYR',
      amount: 25.5,
      description: 'Lunch',
    },
    {
      category: 'Transport',
      subcategory: 'Fuel',
      date: '2026-06-21',
      account: 'Maybank',
      currency: 'MYR',
      amount: 80,
      description: 'Petrol',
    },
    {
      category: 'Shopping',
      subcategory: 'Electronics',
      date: '2026-06-20',
      account: 'Credit Card',
      currency: 'MYR',
      amount: 399,
      description: 'Keyboard',
    },
  ];

  refreshData(): void {
    console.log('Refresh clicked');
  }

  addTransaction(): void {
    this.dialog.open(
      TransactionFormDialog,
      {
        width: '800px',
        maxWidth: '95vw',
        data: {
          mode: 'add',
        },
      }
    );
  }

  downloadExcel(): void {
    console.log('Download Excel clicked');
  }

  toggleColumn(column: string): void {
    this.visibleColumns[column] = !this.visibleColumns[column];
  }

  getVisibleColumns(): string[] {
    return this.displayedColumns.filter(
      column => this.visibleColumns[column]
    );
  }
}