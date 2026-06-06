import { Component } from '@angular/core';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import { ResetPasswordForm } from '../../components/reset-password-form/reset-password-form';

@Component({
  selector: 'app-reset-password-page',
  imports: [AuthLayout, ResetPasswordForm],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss',
})
export class ResetPasswordPage {}
