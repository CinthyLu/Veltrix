import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { StrapiService } from '../../core/services/strapi.service';
import { Programador } from '../../core/models/models';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly strapiService = inject(StrapiService);

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
      },
      error: (err) => {
        console.error('Error al cargar detalles del programador:', err);
        this.loading.set(false);
      }
    });
  }
}
