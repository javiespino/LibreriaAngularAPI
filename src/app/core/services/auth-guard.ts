import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  const allowedRoles = route.data?.['roles'] as Role[] | undefined;
  if (allowedRoles && !allowedRoles.includes(auth.currentUser()!.role)) {
    return router.parseUrl('/unauthorized');
  }

  return true;
};