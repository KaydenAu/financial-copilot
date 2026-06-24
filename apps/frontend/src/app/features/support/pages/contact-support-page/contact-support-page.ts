import { Component, inject, signal } from '@angular/core';
import { SharedModules } from '../../../../../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { SupportApi } from '../../services/support-api';

interface Category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-contact-support-page',
  imports: [...SharedModules, MatExpansionModule],
  templateUrl: './contact-support-page.html',
  styleUrl: './contact-support-page.scss',
})
export class ContactSupportPage {
  selectedValue!: string;
  categories: Category[] = [
    { value: 'account', viewValue: 'Account Issues' },
    { value: 'transactions', viewValue: 'Transactions' },
    { value: 'billing', viewValue: 'Billing & Subscription' },
    { value: 'security', viewValue: 'Security & Privacy' },
    { value: 'technical', viewValue: 'Technical Support' },
    { value: 'feature', viewValue: 'Feature Request' }
  ];

  private readonly supportService = inject(SupportApi);
  
  public showSuccessBanner = signal(false);
  public isSubmitting = signal(false);
  public contactName = signal('');
  public email = signal('');
  public category = signal('');
  public message = signal('');

  public onSendMessage(): void {
    // Prevent duplicate multi-clicks during active execution
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    
    const structuredMessageJson = {
      userName: this.contactName(),
      email: this.email(),
      messageBody: this.message(),
      clientTimestamp: new Date().toISOString(),
      metadata: {
        browserAgent: navigator.userAgent
      }
    };
    const payload = {
      subject: this.getCategoryLabel(this.category()),
      message: JSON.stringify(structuredMessageJson)
    };

    this.supportService.submitTicket(payload).subscribe({
      next: (response) => {
        console.log('Ticket dispatched successfully:', response);
        this.isSubmitting.set(false);
        this.showSuccessBanner.set(true);
        this.resetSupportForm();
        // Auto-dismiss after 5 seconds
        setTimeout(() => this.showSuccessBanner.set(false), 5000);
      },
      error: (error: any) => {
        console.error('Failed to submit support ticket:', error);
        this.isSubmitting.set(false);
      }
    });
  }

  private getCategoryLabel(value: string): string {
    const match = this.categories.find(c => c.value === value);
    return match ? match.viewValue : 'General';
  }

  private resetSupportForm(): void {
    this.contactName.set('');
    this.email.set('');
    this.category.set('');
    this.message.set('');
  }
}
