import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { SharedModules } from '../../../../../shared/shared.module';
import { CoreLayoutApi } from '../../../../../shared/services/core-layout-api';
import { ProfileApi } from '../../services/profile-api';

@Component({
  selector: 'app-personal-info-page',
  imports: [...SharedModules],
  templateUrl: './personal-info-page.html',
  styleUrl: './personal-info-page.scss',
})
export class PersonalInfoPage {
  private coreLayoutService = inject(CoreLayoutApi);
  private profileService = inject(ProfileApi);

  public showSuccessBanner = signal(false);
  public deleteState = signal<'idle' | 'confirm' | 'password'>('idle');
  public deletePassword = signal('');
  public isDeleting = signal(false);
  public deleteError = signal<string | null>(null);

  public userName = linkedSignal(() => this.coreLayoutService.userName());
  public email = linkedSignal(() => this.coreLayoutService.email());
  public firstName = linkedSignal(() => this.coreLayoutService.firstName());
  public lastName = linkedSignal(() => this.coreLayoutService.lastName());
  public preferredCurrency = linkedSignal(() => this.coreLayoutService.preferredCurrency());
  public timezone = linkedSignal(() => this.coreLayoutService.timezone());
  public dateFormat = linkedSignal(() => this.coreLayoutService.dateFormat());
  public numberFormat = linkedSignal(() => this.coreLayoutService.numberFormat());

  public currencies = [
    { code: 'USD', name: 'USD ($)' },
    { code: 'EUR', name: 'EUR (€)' },
    { code: 'GBP', name: 'GBP (£)' },
    { code: 'MYR', name: 'MYR (RM)' }
  ];

  public timezones = [
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
    { value: 'America/New_York', label: 'Eastern Time (ET) - New York' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT) - London' },
    { value: 'Asia/Kuala_Lumpur', label: 'Malaysia Time (MYT) - Kuala Lumpur' }
  ];

  public dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g., 06/17/2026)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g., 17/06/2026)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO Standard)' }
  ];

  public numberFormats = [
    { value: 'comma-dot', label: '1,234,567.89 (Standard Comma)' },
    { value: 'dot-comma', label: '1.234.567,89 (European Dot)' },
    { value: 'space-comma', label: '1 234 567,89 (Space Separator)' }
  ];

  public reportingName = computed(() => {
    const first = this.coreLayoutService.firstName().trim();
    const last = this.coreLayoutService.lastName().trim();
    return (first || last) ? `${first} ${last}`.trim() : this.coreLayoutService.userName();
  });

  public onSaveChanges(): void {
    const payload = {
      user:{
        email: this.email(),
        userName: this.userName(),
      },
      profile: {           
        firstName: this.firstName(),
        lastName: this.lastName(),
        preferredCurrency: this.preferredCurrency(),
        timezone: this.timezone(),
        dateFormat: this.dateFormat(),
        numberFormat: this.numberFormat()
      }
    };

    this.profileService.updateUserProfile(payload).subscribe({
      next: (response) => {
        console.log('Configurations securely saved:', response);
        this.showSuccessBanner.set(true);
        setTimeout(() => this.showSuccessBanner.set(false), 5000);
      }, 
      error: (error) => {
        console.error('Configuration save failed:', error);
      }
    });
  }

  public onDeleteCancel(): void {
    this.deleteState.set('idle');
    this.deletePassword.set('');
    this.deleteError.set(null);
    this.isDeleting.set(false);
  }

  public onDeleteAllUserData(): void {
    const passwordPayload = this.deletePassword().trim();
    
    if (!passwordPayload) {
      this.deleteError.set('Please enter your account password to proceed.');
      return;
    }

    console.warn('Executing purge sequence...');
    this.isDeleting.set(true);
    this.deleteError.set(null);

    this.profileService.deleteUserAccount(passwordPayload).subscribe({
      next: (response) => {
        console.log('Account successfully deleted:', response);
        this.isDeleting.set(false);
      }, 
      error: (error) => {
        console.error('Account deletion rejected:', error);
        this.isDeleting.set(false);
        this.deleteError.set(error.message);
      }
    });
  }
}
