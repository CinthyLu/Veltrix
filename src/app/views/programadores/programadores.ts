import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { StrapiService } from '../../core/services/strapi.service';
import { Observable } from 'rxjs';
import { Programador } from '../../core/models/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-programadores',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './programadores.html',
  styleUrls: ['./programadores.scss'],
})
export class Programadores implements OnInit {
  private strapiService = inject(StrapiService);
  
  // Observable que contiene la lista de programadores
  programadores$!: Observable<Programador[]>;

  ngOnInit() {
    // Llamada al endpoint de Strapi que devuelve los programadores
    this.programadores$ = this.strapiService.getProgramadores();
  }
}