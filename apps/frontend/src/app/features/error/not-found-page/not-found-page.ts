import { Component, computed, inject } from '@angular/core';
import { SharedModules } from '../../../../shared/shared.module';
import { AuthApi } from '../../../core/auth/services/auth-api';

@Component({
  selector: 'app-not-found-page',
  imports: [...SharedModules],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})

export class NotFoundPage {
  private readonly authApi = inject(AuthApi);
  protected readonly isLoggedIn = computed(() => this.authApi.currentUser() !== null);
}