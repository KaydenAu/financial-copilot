import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { SharedModules } from '../../../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { TransactionFormDialog } from '../transaction-form-dialog/transaction-form-dialog';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [
    ...SharedModules,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './transaction-table.html',
  styleUrl: './transaction-table.scss',
})

export class TransactionTable implements AfterViewInit {
  @Input() transactions: any[] = [];
  @Input() visibleColumns: Record<string, boolean> = {};

  dataSource = new MatTableDataSource<any>();

  columnFilters: Record<string, string> = {
    category: '',
    subcategory: '',
    date: '',
    account: '',
    currency: '',
    amount: '',
    description: '',
  };

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

  constructor(
    private dialog: MatDialog
  ) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnChanges(): void {
    this.dataSource.data = this.transactions;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data, filter) => {
      const filters = JSON.parse(filter);

      return Object.keys(filters).every(key => {
        const value = String(data[key] ?? '')
          .toLowerCase();
        return value.includes(
          filters[key].toLowerCase()
        );
      });
    };
  }

  applyColumnFilter(): void {
    this.dataSource.filter = JSON.stringify(
      this.columnFilters
    );
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns.filter(
      column => this.visibleColumns[column]
    );
  }

  editTransaction(row: any): void {
    this.dialog.open(
      TransactionFormDialog,
      {
        width: '800px',
        maxWidth: '95vw',
        data: {
          mode: 'edit',
          transaction: row,
        },
      }
    );
  }

  deleteTransaction(row: any): void {
    console.log('Delete', row);
  }
}