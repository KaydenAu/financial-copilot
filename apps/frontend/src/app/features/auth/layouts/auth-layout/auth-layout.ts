import { Component } from '@angular/core';
import { SharedModules } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-auth-layout',
  imports: [...SharedModules],
  templateUrl: './auth-layout.html',
  styleUrls: [
    '../../_auth-layout.scss',
    './auth-layout.scss'
  ]
})
export class AuthLayout {}
