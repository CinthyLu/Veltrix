import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { StrapiService } from '../../core/services/strapi.service';
import { Programador, Proyecto, Servicio } from '../../core/models/models';

@Component({
  selector: 'app-home',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly strapiService = inject(StrapiService);

  programmers = signal<Programador[]>([]);
  services = signal<Servicio[]>([]);
  featuredProjects = signal<Proyecto[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadHomeData();
  }

  private loadHomeData() {
    this.loading.set(true);

    // 1. Cargar Programadores
    this.strapiService.getProgramadores().subscribe({
      next: (progs) => this.programmers.set(progs),
      error: (err) => console.error('Error al cargar programadores:', err)
    });

    // 2. Cargar Servicios
    this.strapiService.getServicios().subscribe({
      next: (servs) => this.services.set(servs),
      error: (err) => console.error('Error al cargar servicios:', err)
    });

    // 3. Cargar Proyectos Destacados
    this.strapiService.getProyectosDestacados().subscribe({
      next: (projs) => {
        this.featuredProjects.set(projs);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar proyectos destacados:', err);
        this.loading.set(false);
      }
    });
  }
}