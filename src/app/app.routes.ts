import { Routes } from '@angular/router';
import { authGuard } from './auth-guard-guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((com) => com.Dashboard),
  },
  {
    path: 'qr-reader',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/qr-reader/qr-reader').then((com) => com.QrReader),
  },
  {
    path: 'user-info',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-info/user-info').then((com) => com.UserInfo),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup').then((com) => com.Signup),
  },
  {
    path: '',
    loadComponent: () => import('./pages/login/login').then((com) => com.Login),
  },
];
