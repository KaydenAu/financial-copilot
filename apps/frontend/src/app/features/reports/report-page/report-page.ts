// import { Component } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';

// @Component({
//   selector: 'app-reports-page',
//   imports: [MatIconModule],
//   templateUrl: './reports-page.html',
//   styleUrl: './reports-page.scss',
// })
// export class ReportsPage { }

import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ReportFormDialog } from '../report-form-dialog/report-form-dialog';

@Component({
  selector: 'app-reports-page',
  imports: [
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './report-page.html',
  styleUrl: './report-page.scss',
})
export class ReportPage {

  private dialog = inject(MatDialog);

  openReportDialog(reportType: string): void {
    this.dialog.open(ReportFormDialog, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: false,
      data: {
        reportType
      }
    });
  }

}