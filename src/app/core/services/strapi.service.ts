import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Programador, Proyecto, Servicio, HomeContent, StrapiResponse } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class StrapiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.strapiUrl;

  /** Obtiene todos los programadores */
  getProgramadores(): Observable<Programador[]> {
    return this.http
      .get<StrapiResponse<Programador[]>>(`${this.apiUrl}/programadores?populate=*`)
      .pipe(map((res) => res.data));
  }

  /** Obtiene un programador por su documentId */
  getProgramadorById(documentId: string): Observable<Programador> {
    return this.http
      .get<StrapiResponse<Programador>>(`${this.apiUrl}/programadores/${documentId}?populate=*`)
      .pipe(map((res) => res.data));
  }

  /** Obtiene todos los proyectos */
  getProyectos(): Observable<Proyecto[]> {
    return this.http
      .get<StrapiResponse<Proyecto[]>>(`${this.apiUrl}/proyectos?populate=*`)
      .pipe(map((res) => res.data));
  }

  /** Obtiene los proyectos destacados */
  getProyectosDestacados(): Observable<Proyecto[]> {
    return this.http
      .get<StrapiResponse<Proyecto[]>>(`${this.apiUrl}/proyectos?filters[destacado][$eq]=true&populate=*`)
      .pipe(map((res) => res.data));
  }

  /** Obtiene todos los servicios */
  getServicios(): Observable<Servicio[]> {
    return this.http
      .get<StrapiResponse<Servicio[]>>(`${this.apiUrl}/servicios?populate=*`)
      .pipe(map((res) => res.data));
  }

  /** Obtiene el contenido de la página de inicio (Home) */
  getHome(): Observable<HomeContent> {
    return this.http
      .get<StrapiResponse<HomeContent>>(`${this.apiUrl}/home?populate=*`)
      .pipe(map((res) => res.data));
  }
}
