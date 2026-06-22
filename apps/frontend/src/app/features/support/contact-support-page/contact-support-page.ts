import { Component } from '@angular/core';
import { SharedModules } from '../../../../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';

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

}
