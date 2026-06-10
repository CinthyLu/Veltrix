import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { StrapiService } from '../../core/services/strapi.service';
import { SeoService } from '../../core/services/seo.service';
import { Programador } from '../../core/models/models';
import gsap from 'gsap';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly strapiService = inject(StrapiService);
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  programmer = signal<Programador | null>(null);
  loading = signal<boolean>(true);

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
