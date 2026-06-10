import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Ampliamos la interfaz para incluir el rol y el nombre
interface UserDisplay {
  name: string;
  email: string | null;
  isProgrammer: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
})
export class Header {
  private authService = inject(AuthService);

  currentUser$: Observable<UserDisplay | null> = this.authService.currentUser$.pipe(
    map((user: any) => { // 'any' temporal para acceder a propiedades de Firebase
      if (!user) return null;
      
      return {
        // Usamos displayName si existe, sino el email
        name: user.displayName || user.email?.split('@')[0] || 'Usuario',
        email: user.email,
        // Ajusta 'user.role' según cómo guardes el rol en tu objeto usuario
        isProgrammer: user.role === 'programador' 
      };
    })
  );

  logout() {
    this.authService.logout();
  }
}