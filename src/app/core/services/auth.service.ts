import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  /** Observable del usuario actual (null si no autenticado) */
  readonly currentUser$ = user(this.auth);

  /** Registra un nuevo usuario externo con email y contraseña */
  register(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  /** Inicia sesión con email y contraseña */
  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /** Inicio de sesión con cuenta de Google (opcional extra) */
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  /** Cierra la sesión del usuario actual */
  logout() {
    return from(signOut(this.auth));
  }
}
