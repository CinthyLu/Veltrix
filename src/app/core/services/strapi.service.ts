import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  HomeContent,
  Programador,
  Proyecto,
  Servicio,
  StrapiResponse,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.strapiUrl;

  // ── Populate helper ──────────────────────────────────────
  private url(path: string, populate = '*'): string {
    return `${this.base}/${path}?populate=${populate}`;
  }

  // ── Home ─────────────────────────────────────────────────
  getHome(): Observable<HomeContent> {
    return this.http
      .get<StrapiResponse<HomeContent>>(this.url('home'))
      .pipe(map((res) => res.data));
  }

  // ── Programadores ────────────────────────────────────────
  getProgramadores(): Observable<Programador[]> {
    return this.http
      .get<StrapiResponse<Programador[]>>(
        this.url('programadors', 'foto,tecnologias,proyectos')
      )
      .pipe(map((res) => res.data));
  }

  getProgramadorById(documentId: string): Observable<Programador> {
    return this.http
      .get<StrapiResponse<Programador>>(
        `${this.base}/programadors/${documentId}?populate=foto,tecnologias,proyectos.imagen,proyectos.tecnologias`
      )
      .pipe(map((res) => res.data));
  }

  // ── Proyectos ────────────────────────────────────────────
  getProyectos(): Observable<Proyecto[]> {
    return this.http
      .get<StrapiResponse<Proyecto[]>>(
        this.url('proyectos', 'imagen,tecnologias,programadores')
      )
      .pipe(map((res) => res.data));
  }

  getProyectosDestacados(): Observable<Proyecto[]> {
    return this.http
      .get<StrapiResponse<Proyecto[]>>(
        `${this.base}/proyectos?filters[destacado][$eq]=true&populate=imagen,tecnologias,programadores`
      )
      .pipe(map((res) => res.data));
  }

  // ── Servicios ────────────────────────────────────────────
  getServicios(): Observable<Servicio[]> {
    return this.http
      .get<StrapiResponse<Servicio[]>>(this.url('servicios'))
      .pipe(map((res) => res.data));
  }
}
