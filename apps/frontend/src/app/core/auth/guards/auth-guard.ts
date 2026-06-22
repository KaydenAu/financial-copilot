import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApi } from '../services/auth-api';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthApi);
  const router = inject(Router);

  return authService.token.pipe(
    take(1),
    map(token => {
      if (token){ return true; }
      console.warn(`AuthGuard Intercepted unauthenticated navigation request to: ${state.url}`);
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};
