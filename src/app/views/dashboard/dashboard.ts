import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { StrapiService } from '../../core/services/strapi.service';
import { Programador, Solicitud } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly strapiService = inject(StrapiService);

  // Estados de vista
  isProgrammer = signal<boolean>(false);
  loading = signal<boolean>(true);
  programmersList = signal<Programador[]>([]);

  // Listas de Solicitudes (Simuladas/Mock para esta fase de navegación)
  solicitudesEnviadas = signal<Solicitud[]>([
    {
      id: 'sol-001',
      uid: 'user-123',
      correoUsuario: 'client@domain.com',
      nombreSolicitante: 'Corporación Alpha',
      correoSolicitante: 'client@domain.com',
      descripcionProyecto: 'Desarrollo de plataforma E-Commerce asimétrica y ultra rápida con Angular SSR y Strapi CMS.',
      programadorId: 'prog-1',
      programadorNombre: 'Mora',
      fechaCreacion: new Date('2026-05-25T14:30:00'),
      estado: 'Respondida',
      observacion: 'PROPUESTA ACEPTADA. INICIAMOS EL ANÁLISIS DE REQUERIMIENTOS EN 24 HORAS.'
    },
    {
      id: 'sol-002',
      uid: 'user-123',
      correoUsuario: 'client@domain.com',
      nombreSolicitante: 'Corporación Alpha',
      correoSolicitante: 'client@domain.com',
      descripcionProyecto: 'Aplicación 3D interactiva en tiempo real para visualización de catálogo industrial con Spline.',
      programadorId: 'prog-2',
      programadorNombre: 'Ramón',
      fechaCreacion: new Date('2026-05-28T09:15:00'),
      estado: 'Pendiente'
    }
  ]);

  solicitudesRecibidas = signal<Solicitud[]>([
    {
      id: 'sol-101',
      uid: 'client-99',
      correoUsuario: 'empresa_externa@domain.com',
      nombreSolicitante: 'StartUp Omega',
      correoSolicitante: 'empresa_externa@domain.com',
      descripcionProyecto: 'Reestructuración estética profunda y optimización del portal corporativo utilizando GSAP.',
      programadorId: 'prog-1',
      programadorNombre: 'Mora',
      fechaCreacion: new Date('2026-05-27T18:00:00'),
      estado: 'Pendiente'
    }
  ]);

  ngOnInit() {
    // 1. Obtener los programadores desde Strapi para mapeo y listado
    this.strapiService.getProgramadores().subscribe({
      next: (progs) => {
        this.programmersList.set(progs);
        this.checkUserRole(progs);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private checkUserRole(programmers: Programador[]) {
    // 2. Verificar el email del usuario autenticado
    this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user && user.email) {
          // Si el correo electrónico coincide con algún programador de Strapi, habilitar vista de Programador
          const isProg = programmers.some(p => p.email.toLowerCase() === user.email?.toLowerCase());
          this.isProgrammer.set(isProg);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  // Responder solicitud (Simulación)
  onResponder(solId: string, observacion: string) {
    if (!observacion.trim()) return;

    this.solicitudesRecibidas.update(sols => 
      sols.map(s => s.id === solId ? { ...s, estado: 'Respondida', observacion: observacion.toUpperCase() } : s)
    );
  }
}
