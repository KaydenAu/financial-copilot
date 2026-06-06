import { Component } from '@angular/core';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import { RegisterForm } from '../../components/register-form/register-form';

@Component({
  selector: 'app-register-page',
  imports: [AuthLayout, RegisterForm],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {}
