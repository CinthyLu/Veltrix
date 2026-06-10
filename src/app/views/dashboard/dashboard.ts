import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StrapiService } from '../../core/services/strapi.service';
import { Programador, Solicitud } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, UpperCasePipe, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly strapiService = inject(StrapiService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  // Estados de vista
  isProgrammer = signal<boolean>(false);
  loading = signal<boolean>(true);
  programmersList = signal<Programador[]>([]);

  // Listas de Solicitudes reales
  solicitudesEnviadas = signal<Solicitud[]>([]);
  solicitudesRecibidas = signal<Solicitud[]>([]);

  // Datos del usuario logueado
  currentUserEmail: string | null = null;
  currentUserUid: string | null = null;

  // Formulario reactivo para enviar propuesta
  solicitudForm = this.fb.nonNullable.group({
    programadorId: ['', Validators.required],
    nombreSolicitante: ['', [Validators.required, Validators.minLength(3)]],
    descripcionProyecto: ['', [Validators.required, Validators.minLength(10)]]
  });

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
        if (user) {
          this.currentUserEmail = user.email || null;
          this.currentUserUid = user.uid;

          // Autocompletar el nombre si está disponible en Firebase Auth
          this.solicitudForm.patchValue({
            nombreSolicitante: user.displayName || ''
          });

          // Leer queryParams para preseleccionar programador si viene desde el perfil
          this.route.queryParams.subscribe(params => {
            const progId = params['progId'];
            if (progId) {
              this.solicitudForm.patchValue({
                programadorId: progId
              });
            }
          });

          // Si el correo electrónico coincide con algún programador de Strapi, habilitar vista de Programador
          const isProg = programmers.some(p => p.Contact_Email.toLowerCase() === user.email?.toLowerCase());
          this.isProgrammer.set(isProg);

          // Cargar solicitudes correspondientes
          this.cargarSolicitudes();
        } else {
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  cargarSolicitudes() {
    this.loading.set(true);
    if (this.isProgrammer() && this.currentUserEmail) {
      this.strapiService.getSolicitudesDeProgramador(this.currentUserEmail).subscribe({
        next: (sols) => {
          this.solicitudesRecibidas.set(sols);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (this.currentUserUid) {
      this.strapiService.getSolicitudesDeUsuario(this.currentUserUid).subscribe({
        next: (sols) => {
          this.solicitudesEnviadas.set(sols);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  // Enviar nueva propuesta
  onEnviarSolicitud() {
    if (this.solicitudForm.invalid || !this.currentUserUid || !this.currentUserEmail) return;

    const { programadorId, nombreSolicitante, descripcionProyecto } = this.solicitudForm.getRawValue();

    const nuevaSol: Partial<Solicitud> = {
      uid: this.currentUserUid,
      correoUsuario: this.currentUserEmail,
      nombreSolicitante,
      correoSolicitante: this.currentUserEmail,
      descripcionProyecto,
      programadorId
    };

    this.strapiService.crearSolicitud(nuevaSol).subscribe({
      next: (created) => {
        this.solicitudesEnviadas.update(sols => [created, ...sols]);
        this.solicitudForm.reset({
          programadorId: '',
          nombreSolicitante: this.authService.currentUser$ ? nombreSolicitante : '',
          descripcionProyecto: ''
        });
      },
      error: (err) => {
        console.error('Error al enviar la solicitud a Strapi', err);
      }
    });
  }

  // Responder solicitud
  onResponder(solId: string, observacion: string) {
    if (!observacion.trim()) return;

    this.strapiService.responderSolicitud(solId, observacion.toUpperCase()).subscribe({
      next: () => {
        // Actualizar localmente la solicitud en la lista recibida
        this.solicitudesRecibidas.update(sols => 
          sols.map(s => s.id === solId ? { ...s, estado: 'Respondida', observacion: observacion.toUpperCase() } : s)
        );
      },
      error: (err) => {
        console.error('Error al responder la solicitud en Strapi', err);
      }
    });
  }
}
