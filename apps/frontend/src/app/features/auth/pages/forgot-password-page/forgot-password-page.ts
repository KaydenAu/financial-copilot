import { Component } from '@angular/core';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import { ForgotPasswordForm } from '../../components/forgot-password-form/forgot-password-form';

@Component({
  selector: 'app-forgot-password-page',
  imports: [AuthLayout, ForgotPasswordForm],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.scss',
})
export class ForgotPasswordPage {}
