import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { ApiService } from '../../../../shared/services/api-service';
import { Router } from '@angular/router';
import { StorageApi } from '../../../../shared/services/storage-api';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly storageService = inject(StorageApi);
  private readonly baseUrl = environment.apiUrl;
  private readonly tokenKey = 'auth_token';

  // Reactive State Tracking
  private tokenSubject = new BehaviorSubject<string | null>(
    this.storageService.getItem<string>(this.tokenKey)
  );
  public token: Observable<string | null> = this.tokenSubject.asObservable();
  public currentUser = signal<any | null>(null);

  // Cross-application state sync: Automatically adapts state if the token changes elsewhere
  constructor() {
    const savedToken = this.storageService.getItem<string>(this.tokenKey);
    if(savedToken){
      this.currentUser.set(this.decodeTokenClaims(savedToken));
    }
    this.storageService.observeKey<string>(this.tokenKey).subscribe(newToken => {
      this.tokenSubject.next(newToken);
      this.currentUser.set(this.decodeTokenClaims(newToken));
    });
  }
  
  // Standard Email & Password Login Pipeline
  // Sends user credentials to the backend gateway for session validation.
  public loginWithEmailPassword(credentials: any): Observable<any>{
    return this.api.post('/auth/login', credentials).pipe(
      tap(response => this.handleAuthenticationSuccess(response)),
      catchError(error => this.handleAuthenticationFailure(error))
    );
  }

  // Standard Email & Password Registration Pipeline
  // Captures raw form payloads and streams them directly to your security endpoints.
  public registerWithEmailPassword(credentials: any): Observable<any> {
    return this.api.post('/auth/register', credentials).pipe(
      tap(response => this.handleAuthenticationSuccess(response)),
      catchError(error => this.handleAuthenticationFailure(error))
    );
  }

  // Third-Party Federated SSO Gateway (Google)
  // Offloads complex client token management by handing routing states directly 
  // over to a secure backend OAuth2 redirection handler.
  public loginWithGoogle(): void {
    console.log('Handing authorization code grant redirection to server gateway...');
    window.location.href = `${this.baseUrl}/auth/google/login`;
  }

  // Request Password Reset Link
  // Dispatches the targeted user's email address to trigger the automated 
  // transport of the unique verification link via email.
  public requestPasswordReset(credentials: any): Observable<any> {
    return this.api.post('/auth/forgot-password', credentials).pipe(
      catchError(error => this.handleAuthenticationFailure(error))
    );
  }

  // Execute Password Reset
  // Submits the secure confirmation token alongside the newly selected password payload.
  // Automatically intercepts incoming session tokens to authenticate the user smoothly on success.
  public resetPassword(credentials: any): Observable<any> {
    return this.api.post('/auth/reset-password', credentials).pipe(
      tap(response => this.handleAuthenticationSuccess(response)),
      catchError(error => this.handleAuthenticationFailure(error))
    );
  }

  // Tear down the active session state and redirect to login
  public logout(): void {
    this.storageService.removeItem(this.tokenKey);
    this.tokenSubject.next(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  // Unified Session State Persistence
  // Handles storage assignments and internal signal broadcasts on successful handshakes.
  private handleAuthenticationSuccess(authPayload: any): void {
    if (authPayload?.token) {
      this.storageService.setItem(this.tokenKey, authPayload.token);
      this.tokenSubject.next(authPayload.token);
      const profile = this.decodeTokenClaims(authPayload.token);
      this.currentUser.set(profile);
      this.router.navigate(['/', 'dashboard']);
    }
  }

  // Global Stream Error Interception hook
  private handleAuthenticationFailure(error: any): Observable<any> {
    console.error('Authentication boundary error intercepted:', error);
    // throwError ensures the component's .subscribe(error => ...) block still catches it
    return throwError(() => error);
  }

  private decodeTokenClaims(token: string | null): any | null {
    if (!token) return null;
    try {
      const payloadSegment = token.split('.')[1];
      if (!payloadSegment) return null;
      
      // Clean up URL-safe base64 character mapping anomalies before evaluating
      const standardizedBase64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
      const decodedJsonString = atob(standardizedBase64);
      
      return JSON.parse(decodedJsonString); // Resolves token keys like { id, username, email }
    } catch (error) {
      console.error('Failed to translate secure authentication payload claims context:', error);
      return null;
    }
  }
}
