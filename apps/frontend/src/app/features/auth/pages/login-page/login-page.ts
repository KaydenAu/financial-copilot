import { Component } from '@angular/core';
import { LoginForm } from '../../components/login-form/login-form';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';

@Component({
  selector: 'app-login-page',
  imports: [AuthLayout ,LoginForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {

}
