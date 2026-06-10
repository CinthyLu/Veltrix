import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/home/home').then((m) => m.Home),
  },
  // ─── NUEVA RUTA: PROGRAMADORES ───
  {
    path: 'programadores',
    loadComponent: () =>
      import('./views/programadores/programadores').then((m) => m.Programadores),
  },
  // ─── NUEVA RUTA: PROYECTOS ───
  {
    path: 'proyectos',
    loadComponent: () =>
      import('./views/proyectos/proyectos').then((m) => m.Proyectos),
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