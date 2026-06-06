import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModules } from '../../../../../shared/shared.module';
import { PasswordStrengthIndicator, passwordStrengthValidator } from '../password-strength-indicator/password-strength-indicator';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthApi } from '../../../../core/auth/services/auth-api';
import { ActivatedRoute, Router } from '@angular/router';

interface resetPayload {
  token: string;
  newPassword: string;
}

@Component({
  selector: 'app-reset-password-form',
  imports: [PasswordStrengthIndicator, ...SharedModules],
  templateUrl: './reset-password-form.html',
  styleUrls: [
    '../../_auth-layout.scss',
    './reset-password-form.scss',
  ],
})
export class ResetPasswordForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // Internal component memory tracking state for the email token
  private resetToken: string | null = null;
  
  public hideNewPassword = true;
  public hideConfirmNewPassword = true;
  public isLoading = signal(false);
  public errorMessage = signal('');

  public resetPasswordForm = this.formBuilder.nonNullable.group(
    {
      newPassword: ['',[Validators.required, passwordStrengthValidator()]],
      confirmNewPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator}
  );

  ngOnInit(): void {
    this.resetToken = this.route.snapshot.queryParamMap.get('token');

    // Anti-tamper validation fallback: If a user lands here without a token, boot them back to safety
    if (!this.resetToken) {
      console.error('Direct page visibility breach: Query parameter security token missing.');
      this.errorMessage.set('Invalid or missing password reset security validation token.');
      this.router.navigate(['/auth/login']);
    }
  }

  passwordMatchValidator(control: AbstractControl){
    const newPassword  = control.get('newPassword');
    const confirmNewPassword = control.get('confirmNewPassword');

    // If controls are not fully initialized yet, exit early
    if (!newPassword || !confirmNewPassword) return null;

    // If the input is completely empty, clear the mismatch error and let 'required' rule the field
    if (!confirmNewPassword.value || confirmNewPassword.value.trim() === '') {
      if (confirmNewPassword.hasError('passwordMismatch')) {
        const remainingErrors = { ...confirmNewPassword.errors };
        delete remainingErrors['passwordMismatch'];
        confirmNewPassword.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
      return null;
    }

    // If there is text but it does not match, append 'passwordMismatch' error
    if (newPassword.value !== confirmNewPassword.value) {
      confirmNewPassword.setErrors({ ...confirmNewPassword.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // If it perfectly matches, clean up the mismatch flag.
      if (confirmNewPassword.hasError('passwordMismatch')) {
        const remainingErrors = { ...confirmNewPassword.errors };
        delete remainingErrors['passwordMismatch'];
        confirmNewPassword.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
      return null;
    }
  }

  onSubmit(){
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (!this.resetToken) {
      this.errorMessage.set('Your validation session token is missing. Please request a new link.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValues =  this.resetPasswordForm.getRawValue();
    const credentials: resetPayload = {
      token: this.resetToken,
      newPassword: formValues.newPassword,
    } 

    this.authService.resetPassword(credentials).subscribe({
      next: (response) => {
        console.log('Password Reset stream successfully resolved:', response);
        this.isLoading.set(false);
        // Broadcast the success signal to other tabs
        const authChannel = new BroadcastChannel('auth_sync_channel');
        authChannel.postMessage('password-reset-success');
        authChannel.close(); // Clean up the radio instance immediately
      },

      error: (error) => {
        console.error('Password Reset stream threw validation boundary exception:', error);
        let errorText = (
          error?.error?.message || error?.message || 
          'An error occurred while resetting your password.'
        );
        this.errorMessage.set(errorText);
        this.isLoading.set(false);
      },
    });
  }

  onShowNewPassword() { this.hideNewPassword = !this.hideNewPassword; }
  onShowConfirmNewPassword() { this.hideConfirmNewPassword = !this.hideConfirmNewPassword; }

  get newPassword() { return this.resetPasswordForm.get('newPassword')!; }
  get confirmNewPassword() { return this.resetPasswordForm.get('confirmNewPassword')!; }

}
