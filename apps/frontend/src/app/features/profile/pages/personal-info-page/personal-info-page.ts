import { Component, computed, inject, linkedSignal } from '@angular/core';
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

    console.log('Sending aligned payload payload to backend:', payload);
    this.profileService.updateUserProfile(payload).subscribe({
      next: (response) => {
        console.log('Configurations securely saved:', response);
      }, 
      error: (error) => {
        console.error('Configuration save failed:', error);
      }
    });

  }

  public onDeleteAllUserData(): void {
    const confirmation = confirm(
      'CRITICAL WARNING: Are you absolutely sure you want to delete all user data?'
    );
    if (confirmation) {
      console.warn('Executing purge sequence...');
    }
  }

}
