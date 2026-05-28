import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/home/home').then((m) => m.Home),
  },
  {
    path: 'programador/:id',
    loadComponent: () =>
      import('./views/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'login',
    loadComponent: () => import('./views/auth/auth').then((m) => m.Auth),
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import('./views/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  // Redirección en caso de ruta no encontrada
  { path: '**', redirectTo: '' },
];