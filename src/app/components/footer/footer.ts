import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  // Variables con la información de tu footer
  anioActual: number = new Date().getFullYear();
  estudio: string = 'Veltrix Studio';
  curso: string = 'PPW P68';
}
