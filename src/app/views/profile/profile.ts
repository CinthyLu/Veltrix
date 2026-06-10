import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StrapiService } from '../../core/services/strapi.service';
import { SeoService } from '../../core/services/seo.service';
import { AuthService } from '../../core/services/auth.service';
import { Programador } from '../../core/models/models';
import gsap from 'gsap';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, UpperCasePipe, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly strapiService = inject(StrapiService);
  private readonly seoService = inject(SeoService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);

  programmer = signal<Programador | null>(null);
  loading = signal<boolean>(true);

  // Estados de rol y del modal de adición de proyectos
  isOwnProfile = signal<boolean>(false);
  showAddProjectModal = signal<boolean>(false);
  savingProject = signal<boolean>(false);
  selectedFile: File | null = null;

  // Formulario reactivo para registrar nuevos proyectos
  projectForm = this.fb.nonNullable.group({
    Project_Name: ['', [Validators.required, Validators.minLength(3)]],
    tipo_de_proyecto: ['personal', Validators.required],
    Short_description: ['', [Validators.required, Validators.minLength(10)]],
    Full_description: [''],
    Technologies_used: ['', Validators.required], // Ej. "Angular, Tailwind"
    Link_repository: ['', Validators.required],
    Link_demo: [''],
    Featured: [false]
  });

  ngOnInit() {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.loadProgrammerDetails(documentId);
    }
  }

  private loadProgrammerDetails(docId: string) {
    this.loading.set(true);
    this.strapiService.getProgramadorById(docId).subscribe({
      next: (prog) => {
        this.programmer.set(prog);
        this.loading.set(false);
        this.checkIfOwnProfile(prog);

        // SEO dinámico por programador
        const photoUrl = prog.Profile_picture?.url
          ? (prog.Profile_picture.url.startsWith('/') 
              ? 'https://upbeat-chickens-1ee0436960.strapiapp.com' + prog.Profile_picture.url 
              : prog.Profile_picture.url)
          : '';
        this.seoService.generateTags({
          title: `Veltrix Studio - Perfil de ${prog.Full_name}`,
          description: `${prog.Full_name} es especialista en ${prog.Specialty}. ${prog.Short_description}`,
          image: photoUrl,
          route: `/programador/${docId}`
        });

        // Ejecutamos la animación en el siguiente tick del event loop
        setTimeout(() => {
          this.animateProfile();
        }, 50);
      },
      error: (err) => {
        console.error('Error al cargar detalles del programador:', err);
        this.loading.set(false);
      }
    });
  }

  private checkIfOwnProfile(prog: Programador) {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user && prog) {
          this.isOwnProfile.set(
            user.email?.toLowerCase() === prog.Contact_Email.toLowerCase()
          );
        } else {
          this.isOwnProfile.set(false);
        }
      },
      error: () => this.isOwnProfile.set(false)
    });
  }

  // Captura el archivo seleccionado del input
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Enviar el nuevo proyecto a Strapi
  onSubmitProject() {
    if (this.projectForm.invalid || !this.programmer()) return;
    this.savingProject.set(true);

    const formValues = this.projectForm.getRawValue();
    // Generar un identificador slug simple del nombre del proyecto
    const slug = formValues.Project_Name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const saveProject = (imageId: number | null) => {
      const docId = this.programmer()?.documentId || '';
      const newProj = {
        Project_Name: formValues.Project_Name,
        Identifier: slug,
        Short_description: formValues.Short_description,
        Full_description: formValues.Full_description,
        tipo_de_proyecto: formValues.tipo_de_proyecto,
        Technologies_used: formValues.Technologies_used,
        Link_repository: formValues.Link_repository,
        Link_demo: formValues.Link_demo || null,
        Featured: formValues.Featured,
        programmers: [docId], // Relación con el programador dueño del perfil
        Main_image: imageId
      };

      this.strapiService.crearProyecto(newProj).subscribe({
        next: () => {
          this.savingProject.set(false);
          this.showAddProjectModal.set(false);
          this.projectForm.reset({
            tipo_de_proyecto: 'personal',
            Featured: false
          });
          this.selectedFile = null;
          // Recargar el perfil para mostrar el nuevo proyecto en la lista
          const id = this.programmer()?.documentId;
          if (id) {
            this.loadProgrammerDetails(id);
          }
        },
        error: (err) => {
          console.error('Error al guardar el proyecto en Strapi:', err);
          this.savingProject.set(false);
        }
      });
    };

    if (this.selectedFile) {
      this.strapiService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          // El ID devuelto es numérico y se usa para la relación de media en Strapi
          const imageId = res[0]?.id || null;
          saveProject(imageId);
        },
        error: (err) => {
          console.error('Error al subir la imagen:', err);
          // Si falla la imagen, creamos el proyecto de todos modos sin foto
          saveProject(null);
        }
      });
    } else {
      saveProject(null);
    }
  }

  private animateProfile() {
    if (isPlatformBrowser(this.platformId)) {
      gsap.from('.profile-card', {
        duration: 0.8,
        x: -30,
        opacity: 0,
        ease: 'power3.out'
      });

      gsap.from('.profile-content', {
        duration: 0.8,
        x: 30,
        opacity: 0,
        delay: 0.2,
        ease: 'power3.out'
      });

      gsap.from('.project-card', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power2.out'
      });
    }
  }
}
