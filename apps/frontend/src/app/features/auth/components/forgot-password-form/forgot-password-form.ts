import { Component, inject, OnDestroy, signal } from '@angular/core';
import { SharedModules } from '../../../../../shared/shared.module';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthApi } from '../../../../core/auth/services/auth-api';
import { Router } from '@angular/router';

interface forgotPasswordPayload {
  email: string;
}

@Component({
  selector: 'app-forgot-password-form',
  imports: [...SharedModules],
  templateUrl: './forgot-password-form.html',
  styleUrls: [
    '../../_auth-layout.scss',
    './forgot-password-form.scss',
  ],
})
export class ForgotPasswordForm implements OnDestroy{
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthApi);
  private router = inject(Router);
  private authChannel!: BroadcastChannel;
  
  public isLoading = signal(false);
  public isEmailSent = signal(false);
  public isTimerActive = signal(false);
  public errorMessage = signal('');

  // Countdown timer tracking setups
  public  countdownSeconds = signal(59);
  private timerInterval: any;

  forgotPasswordForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  })

  ngOnInit() {
    // Tune into the radio channel
    this.authChannel = new BroadcastChannel('auth_sync_channel');

    // Listen for incoming messages
    this.authChannel.onmessage = (event) => {
      if (event.data === 'password-reset-success') {
        console.log('Cross-tab event caught: Password updated elsewhere.');
        // Clean up and route this old tab straight back to login!
        this.clearCountdown();
        this.router.navigate(['/auth/login']);
      }
    };
  }

  ngOnDestroy(){
    this.clearCountdown();
    // Disconnect from the radio channel when component dies to prevent memory leaks!
    if (this.authChannel) {
      this.authChannel.close();
    }
  }

  onSubmit(){
    if(this.forgotPasswordForm.invalid){
      this.forgotPasswordForm.markAllAsTouched();
      return ; 
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials = this.forgotPasswordForm.getRawValue() as forgotPasswordPayload

    this.authService.requestPasswordReset(credentials).subscribe({
      next: (response) => {
        console.log('Request password reset stream successfully resolved:', response);
        this.isLoading.set(false);
        this.isEmailSent.set(true);
        this.startResendCountdown();
      },

      error: (error) => {
        console.error('Request password reset stream threw validation boundary exception:',error);
        let errorText = (
          error?.error?.message || error?.message || 
          'Failed to send verification link. Please check the email and try again.'
        );
        this.errorMessage.set(errorText);
        this.isLoading.set(false);
      },
    });
  }

  get email(){ return this.forgotPasswordForm.controls.email; }

  startResendCountdown(){
    this.clearCountdown();
    this.countdownSeconds.set(59);
    this.isTimerActive.set(true);

    this.timerInterval = setInterval(() => {
      this.countdownSeconds.update(current => current - 1);
      if (this.countdownSeconds() <= 0) {
        this.clearCountdown();
      }
    }, 1000);
  }

  resendLink(){
    if (this.isTimerActive() || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials = this.forgotPasswordForm.getRawValue() as forgotPasswordPayload;

    this.authService.requestPasswordReset(credentials).subscribe({
      next: (response) => {
        console.log('Resend password reset stream successfully resolved:', response);
        this.isLoading.set(false);
        this.startResendCountdown();
      },
      error: (error) => {
        console.error('Resend stream encountered an exception:', error);
        let errorText = error?.error?.message || error?.message || 'Failed to resend link.';
        this.errorMessage.set(errorText);
        this.isLoading.set(false);
      }
    });
  }

  private clearCountdown() {
    this.isTimerActive.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
