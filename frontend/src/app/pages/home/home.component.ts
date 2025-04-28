import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- AGREGA ESTO

@Component({
  selector: 'app-home',
  standalone: true, // <-- asegúrate que diga standalone
  imports: [CommonModule], // <-- AGREGA CommonModule aquí
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('videoFondo') videoFondo!: ElementRef<HTMLVideoElement>;

  eventos = [
    {
      titulo: 'Feria del Libro',
      fecha: '10 de mayo de 2025',
      imagen: 'assets/images/evento1.jpg'
    },
    {
      titulo: 'Conferencia de Historia',
      fecha: '20 de junio de 2025',
      imagen: 'assets/images/evento2.jpg'
    },
    {
      titulo: 'Taller de Escritura Creativa',
      fecha: '5 de julio de 2025',
      imagen: 'assets/images/evento3.jpg'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.videoFondo?.nativeElement) {
      this.videoFondo.nativeElement.muted = true;
      this.videoFondo.nativeElement.play().catch(error => {
        console.error('Error reproduciendo video automáticamente:', error);
      });
    }
  }
}
