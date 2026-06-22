import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageApi } from '../../../../shared/services/storage-api';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve the raw JWT string saved during successful login stream
  // If a token exists, securely clone the request and append the Authorization Header
  const storageService = inject(StorageApi);
  const token = storageService.getItem('auth_token');

  console.log(`[Auth Interceptor] Inspecting request to: ${req.url}`);
  console.log(`[Auth Interceptor] Token lookup result:`, token);

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Fallback to un-mutated stream if no token is stored yet
  return next(req);
};
