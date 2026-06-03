import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// 1. Interfaz ajustada para aceptar string o null
interface UserDisplay {
  email: string | null; 
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
})
export class Header {
  private authService = inject(AuthService);

  // 2. Observable tipado correctamente usando la interfaz
  currentUser$: Observable<UserDisplay | null> = this.authService.currentUser$.pipe(
    map(user => user ? { email: user.email } : null)
  );

  logout() {
    // Si tu logout devuelve un observable (ej. Firebase), recuerda suscribirte
    // this.authService.logout().subscribe();
    this.authService.logout(); 
  }
}