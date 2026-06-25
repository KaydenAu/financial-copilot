import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule
  ],
  templateUrl: './transaction-table.html',
  styleUrl: './transaction-table.scss',
})
export class TransactionTable implements AfterViewInit, OnChanges {

  @Input() transactions: any[] = [];

  @Input() visibleColumns: Record<string, boolean> = {
    category: true,
    subcategory: true,
    transactionDate: true,
    account: true,
    currency: true,
    amount: true,
    description: true,
    action: true,
  };

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  dataSource = new MatTableDataSource<any>();

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(): void {
    this.dataSource.data = this.transactions;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns.filter(
      c => this.visibleColumns[c]
    );
  }

  onEdit(row: any): void {
    this.edit.emit(row);
  }

  onDelete(row: any): void {
    this.delete.emit(row);
  }
}