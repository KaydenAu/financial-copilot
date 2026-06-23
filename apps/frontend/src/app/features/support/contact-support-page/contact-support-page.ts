import { Component } from '@angular/core';
import { SharedModules } from '../../../../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { SupportService } from '../support.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectorRef } from '@angular/core';

interface Category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-contact-support-page',
  imports: [...SharedModules, MatExpansionModule, MatProgressSpinnerModule,
    MatSnackBarModule],
  templateUrl: './contact-support-page.html',
  styleUrl: './contact-support-page.scss',
})

export class ContactSupportPage {
  selectedValue = '';
  name = '';
  email = '';
  message = '';
  loading = false;

  constructor(
    private supportService: SupportService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  categories: Category[] = [
    { value: 'ACCOUNT', viewValue: 'Account Issues' },
    { value: 'TRANSACTIONS', viewValue: 'Transactions' },
    { value: 'BILLING', viewValue: 'Billing & Subscription' },
    { value: 'SECURITY', viewValue: 'Security & Privacy' },
    { value: 'TECHNICAL', viewValue: 'Technical Support' },
    { value: 'FEATURE', viewValue: 'Feature Request' }
  ];

  submitForm() {
    if (this.loading) return;
    this.loading = true;
    const payload = {
      name: this.name,
      email: this.email,
      category: this.selectedValue,
      message: this.message
    };

    this.supportService.createTicket(payload).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(
          'Support request sent successfully',
          'Close',
          { duration: 3000 }
        );

        queueMicrotask(() => {
          this.resetForm();
          this.cdr.detectChanges();
        });
      },

      error: (err) => {
        this.loading = false;
        this.snackBar.open(
          err?.error?.message || 'Something went wrong',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.selectedValue = '';
    this.message = '';
  }
}