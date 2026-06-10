import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common'; // Necesario para el pipe | async
import { RouterLink } from '@angular/router'; // Necesario para los enlaces
import { Observable } from 'rxjs';
import { StrapiService } from '../../core/services/strapi.service';
import { Proyecto } from '../../core/models/models'; // Ajusta la ruta a tu archivo de modelos

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [AsyncPipe, RouterLink], // Importante incluir aquí
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.scss'],
})
export class Proyectos implements OnInit {
  private strapiService = inject(StrapiService);
  
  // Debes declarar el tipo del Observable
  proyectos$!: Observable<Proyecto[]>;
  
  ngOnInit() {
    this.proyectos$ = this.strapiService.getProyectos();
  }
}