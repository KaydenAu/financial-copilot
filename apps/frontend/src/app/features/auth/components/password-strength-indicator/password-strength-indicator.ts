import { Component, Input } from '@angular/core';
import { SharedModules } from '../../../../../shared/shared.module';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export type StrengthState = 'none' | 'weak' | 'fair' | 'good' | 'strong';

@Component({
  selector: 'app-password-strength-indicator',
  imports: [...SharedModules],
  templateUrl: './password-strength-indicator.html',
  styleUrls: [
    '../../_auth-layout.scss',
    './password-strength-indicator.scss'
  ],
  host:{
    '[class.strength-indicator--active]': 'hasPassword'
  }
})
export class PasswordStrengthIndicator {
  @Input({ required: true }) control!: AbstractControl;
  
  get hasPassword(): boolean {
      return !!this.control?.value;
    }

  get passwordChecks() {
    const hasValue = this.hasPassword;
    return {
      length:    hasValue && !this.control.hasError('minlength'),
      uppercase: hasValue && !this.control.hasError('uppercase'),
      number:    hasValue && !this.control.hasError('number'),
      special:   hasValue && !this.control.hasError('specialChar'),
    };
  }

  get passwordStrength(): number {
    return Object.values(this.passwordChecks).filter(Boolean).length;
  }

  get isPasswordValid(): boolean {
    return this.passwordStrength === 4;
  }

  get strengthLevel(): number {
    return this.passwordStrength;
  }

  get strengthLabel(): string {
    switch (this.strengthLevel) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  }

  get strengthState(): StrengthState {
    if (!this.hasPassword) return 'none';
    switch (this.strengthLevel) {
      case 0: return 'weak';
      case 1: return 'weak';
      case 2: return 'fair';
      case 3: return 'good';
      case 4: return 'strong';
      default: return 'none';
    }
  }
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // If the field is empty, let the 'required' validator handle it
    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    if ((value.length < 8)) {
      errors['minlength'] = true;
    }

    // 1. Check for at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
    }

    // 2. Check for at least one numeric digit
    if (!/[0-9]/.test(value)) {
      errors['number'] = true;
    }

    // 3. Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['specialChar'] = true;
    }

    // Return the errors object if any requirements failed, otherwise null (valid)
    return Object.keys(errors).length > 0 ? errors : null;
  };
}
