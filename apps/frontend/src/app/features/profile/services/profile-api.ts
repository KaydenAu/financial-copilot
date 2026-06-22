import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api-service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthApi } from '../../../core/auth/services/auth-api';

export interface userProfilePayload{
  user: {
    email: string,
    userName: string,
  }, 
  profile: {
    firstName?: string;
    lastName?: string;
    preferredCurrency?: string;
    timezone?: string;
    dateFormat?: string;
    numberFormat?: string;
  },
}

@Injectable({
  providedIn: 'root',
})
export class ProfileApi {
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthApi);

  // Get User Profile
  // Fetches the full context profile of the currently authenticated user session.
  public getUserProfile(): Observable<any> {
    return this.api.get('/profile/personal-info').pipe(
      tap(response => this.handleProfileSuccess(response)),
      catchError(error => this.handleProfileFailure(error))
    );
  } 
  
  // Patches partial modifications to the backend registry.
  public updateUserProfile(payload: userProfilePayload): Observable<any> {
    return this.api.patch('/profile/personal-info', payload).pipe(
      tap(response => this.handleProfileSuccess(response)),
      catchError(error => this.handleProfileFailure(error))
    );
  }

  // Dispatches a total account and privacy destruction sequence command.
  public deleteAccount(): Observable<any> {
    return this.api.delete('/profile/personal-info').pipe(
      tap(response => this.handleProfileSuccess(response)),
      catchError(error => this.handleProfileFailure(error))
    );
  }

  private handleProfileSuccess(profilePayload: any): void{
    if (profilePayload?.token){
      this.authService.handleAuthenticationSuccess(profilePayload);
    }
  }
  
  private handleProfileFailure(error: any): Observable<any> {
    console.error('User profile error intercepted:', error);
    let clientErrorMessage = 'Server context synchronization anomaly.';
    if (error.error instanceof ErrorEvent) {
      // Handle frontend-side or network isolation drops
      clientErrorMessage = `Network connectivity drop: ${error.error.message}`;
    } else if (error.error && typeof error.error === 'object') {
      // Extract structural custom errors from Express API overrides
      clientErrorMessage = error.error.message || clientErrorMessage;
    }

    // throwError ensures the component's .subscribe(error => ...) block still catches it
    return throwError(() => new Error(clientErrorMessage));
  }
}
