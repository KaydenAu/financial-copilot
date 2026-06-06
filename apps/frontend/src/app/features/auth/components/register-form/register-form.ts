import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { AuthApi } from '../../../../core/auth/services/auth-api';
import { SharedModules } from '../../../../../shared/shared.module';
import { PasswordStrengthIndicator, passwordStrengthValidator } from '../password-strength-indicator/password-strength-indicator';

interface registerPayload {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

@Component({
  selector: 'app-register-form',
  imports: [PasswordStrengthIndicator, ...SharedModules],
  templateUrl: './register-form.html',
  styleUrls: [
    '../../_auth-layout.scss',
    './register-form.scss',
  ],
})
export class RegisterForm {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthApi);

  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = signal(false);
  errorMessage = signal('');
  
  registerForm = this.formBuilder.nonNullable.group(
    {
      userName:['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]],
      agreedToTerms: [false, [Validators.requiredTrue]],
    }, 
    {validators: this.passwordMatchValidator}
  );

  passwordMatchValidator(control: AbstractControl){
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    // If controls are not fully initialized yet, exit early
    if (!password || !confirmPassword) return null;
    
    // If the input is completely empty, clear the mismatch error and let 'required' rule the field
    if (!confirmPassword.value || confirmPassword.value.trim() === '') {
      if (confirmPassword.hasError('passwordMismatch')) {
        const remainingErrors = { ...confirmPassword.errors };
        delete remainingErrors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
      return null;
    }

    // If there is text but it does not match, append 'passwordMismatch' error
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // If it perfectly matches, clean up the mismatch flag.
      if (confirmPassword.hasError('passwordMismatch')) {
        const remainingErrors = { ...confirmPassword.errors };
        delete remainingErrors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
      return null;
    }
  }

  onSubmit(){
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials = this.registerForm.getRawValue() as registerPayload;

    this.authService.registerWithEmailPassword(credentials).subscribe({
      next: (response) => {
        console.log('Registration stream successfully resolved:', response);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Registration stream threw validation boundary exception:', error);
        let errorText = (
          error?.error?.message || error?.message || 
          'Register failed. Please try again.'
        );
        this.errorMessage.set(errorText);
        this.isLoading.set(false);
      },
    });
  }
  
  onGoogleRegister() { this.authService.loginWithGoogle(); }
  onShowPassword() { this.hidePassword = !this.hidePassword; }
  onShowConfirmPassword() { this.hideConfirmPassword = !this.hideConfirmPassword; }

  get userName() { return this.registerForm.get('userName')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }
}


