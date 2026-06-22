import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthApi } from '../../../../core/auth/services/auth-api';
import { SharedModules } from '../../../../../shared/shared.module';
import { StorageApi } from '../../../../../shared/services/storage-api';


interface loginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login-form',
  imports: [...SharedModules],
  templateUrl: './login-form.html',
  styleUrls: [
    '../../_auth-layout.scss',
    './login-form.scss',
  ],
})
export class LoginForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthApi);
  private storageService = inject(StorageApi);
  private readonly rememberedEmailKey = 'remembered_user_email';

  public hidePassword = true;
  public isLoading = signal(false);
  public errorMessage = signal('');
  
  public loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  ngOnInit(): void {
    // Check if an email was saved in a previous session
    const savedEmail = this.storageService.getItem<string>(this.rememberedEmailKey);
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }

  public onSubmit(){
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return ;
    } 

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials = this.loginForm.getRawValue() as loginPayload;

    this.authService.loginWithEmailPassword(credentials).subscribe({
      next: (response) => {
        console.log('Login stream successfully resolved:', response);

        if (credentials.rememberMe) {
          this.storageService.setItem(this.rememberedEmailKey, credentials.email);
        } else {
          this.storageService.removeItem(this.rememberedEmailKey);
        }

        this.isLoading.set(false);      
      },

      error: (error) => {
        console.error('Login stream threw validation boundary exception:',error);
        let errorText = (
          error?.error?.message || error?.message || 
          'Login failed. Please check your credentials.'
        );
        this.errorMessage.set(errorText);
        this.isLoading.set(false);
      },
    });
  }
  
  public onGoogleRegister() { this.authService.loginWithGoogle(); }
  public onShowPassword(){ this.hidePassword = !this.hidePassword }

  public get email() { return this.loginForm.controls.email; }
  public get password() { return this.loginForm.controls.password; }
};


