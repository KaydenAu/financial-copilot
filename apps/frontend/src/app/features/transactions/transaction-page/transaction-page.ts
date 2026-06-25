import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SharedModules } from '../../../../shared/shared.module';
import { TransactionTable } from '../transaction-table/transaction-table';
import { TransactionFormDialog } from '../transaction-form-dialog/transaction-form-dialog';
import { TransactionsService } from '../transactions.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
export class TransactionPage implements OnInit {

  searchKeyword = '';
  transactions: any[] = [];

  constructor(
    private dialog: MatDialog,
    private transactionApi: TransactionsService,
    private snackBar: MatSnackBar
  ) { }

  displayedColumns = [
    'category',
    'subcategory',
    'transactionDate',
    'account',
    'currency',
    'amount',
    'description',
    'action',
  ];

  visibleColumns: Record<string, boolean> = {
    category: true,
    subcategory: true,
    transactionDate: true,
    account: true,
    currency: true,
    amount: true,
    description: true,
    action: true,
  };

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionApi.getAll().subscribe({
      next: (res) => this.transactions = res,
      error: (err) => console.error(err)
    });
  }

  refreshData(): void {
    this.loadTransactions();
  }

  addTransaction(): void {
    const dialogRef = this.dialog.open(TransactionFormDialog, {
      width: '800px',
      maxWidth: '95vw',
      data: { mode: 'add' },
      panelClass: 'custom-transaction-dialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.transactionApi.create(result).subscribe({
        next: () => {
          this.loadTransactions();
          this.snackBar.open('Transaction created', 'Close', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Create failed', 'Close', { duration: 3000 });
        }
      });
    });
  }

  editTransaction(row: any): void {
    const dialogRef = this.dialog.open(TransactionFormDialog, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        transaction: row,
      },
      panelClass: 'custom-transaction-dialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.transactionApi.update(row.id, result).subscribe({
        next: (updated) => {

          // 🔥 instant UI update (no reload = faster)
          const index = this.transactions.findIndex(t => t.id === row.id);

          if (index !== -1) {
            this.transactions[index] = updated;
            this.transactions = [...this.transactions];
          }

          this.snackBar.open('Updated successfully', 'Close', {
            duration: 2000
          });
        },
        error: () => {
          this.snackBar.open('Update failed', 'Close', {
            duration: 3000
          });
        }
      });
    });
  }

  deleteTransaction(row: any): void {
    if (!confirm('Delete this transaction?')) return;

    this.transactionApi.delete(row.id).subscribe({
      next: () => {
        this.transactions = this.transactions.filter(t => t.id !== row.id);

        this.snackBar.open('Deleted successfully', 'Close', {
          duration: 2000
        });
      },
      error: () => {
        this.snackBar.open('Delete failed', 'Close', {
          duration: 3000
        });
      }
    });
  }

  toggleColumn(column: string): void {
    this.visibleColumns[column] = !this.visibleColumns[column];
  }

  getVisibleColumns(): string[] {
    return this.displayedColumns.filter(
      c => this.visibleColumns[c]
    );
  }

  downloadExcel(): void {
    if (!this.transactions || this.transactions.length === 0) {
      this.snackBar.open('No data to export', 'Close', {
        duration: 2000,
      });
      return;
    }

    // 🔥 map data into clean export format
    const exportData = this.transactions.map(t => ({
      Category: t.category?.name || t.category,
      Subcategory: t.subcategory?.name || t.subcategory,
      Date: new Date(t.transactionDate).toLocaleDateString(),
      Account: t.account,
      Currency: t.currency,
      Amount: t.amount,
      Description: t.description || '',
    }));

    // 📊 create worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // 📁 create workbook
    const workbook: XLSX.WorkBook = {
      Sheets: { Transactions: worksheet },
      SheetNames: ['Transactions'],
    };

    // 📦 convert to buffer
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // 💾 save file
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });

    saveAs(data, `transactions_${new Date().getTime()}.xlsx`);
  }
}