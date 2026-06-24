import { Component, signal } from '@angular/core';
import { SharedModules } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-security-page',
  imports: [...SharedModules],
  templateUrl: './security-page.html',
  styleUrl: './security-page.scss',
})
export class SecurityPage {
  public currentPassword = signal('');
  public newPassword = signal('');
  public confirmPassword = signal('');

  public isSubmitting = signal(false);
  public isMfaEnabled = signal(false);
  public mfaSetupStep = signal<'off' | 'qr' | 'verify' | 'active'>('off');
  public verificationCode = signal('');
  public dummyQrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OTPAuth%3Aotpauth%3A%2F%2Ftotp%2FYourApp%3Akayden%40example.com%3Fsecret%3DNXW2Z337ORUG633F%26issuer%3DYourApp';
  public dummyBackupCodes = ['ABCD-1234', 'EFGH-5678', 'IJKL-9012', 'MNOP-3456'];

  // Password submission shell
  public handlePasswordUpdate(): void {
    if (this.newPassword() !== this.confirmPassword()) {
      alert('New passwords do not match.');
      return;
    }
    this.isSubmitting.set(true);

    console.log('Password payload ready for transmission:', {
      current: this.currentPassword(),
      new: this.newPassword()
    });
    
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.currentPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
      alert('Password updated successfully.');
    }, 1500);
  }

  // MFA Wizard Control Steps (Dummy Flow)
  public startMfaSetup(): void {
    this.mfaSetupStep.set('qr');
  }

  public proceedToVerify(): void {
    this.mfaSetupStep.set('verify');
  }

  public confirmDummyMfa(): void {
    if (this.verificationCode().length === 6) {
      this.isMfaEnabled.set(true);
      this.mfaSetupStep.set('active');
    } else {
      alert('Please enter a valid 6-digit dummy code (e.g., 123456).');
    }
  }

  public disableMfa(): void {
    this.isMfaEnabled.set(false);
    this.mfaSetupStep.set('off');
    this.verificationCode.set('');
  }
}
