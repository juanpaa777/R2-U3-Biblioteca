import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { HttpClientModule } from '@angular/common/http';
import { LibroService } from '../../services/libro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  libros: any[] = [];
  librosFiltrados: any[] = [];
  loading: boolean = false;
  error: string = '';
  busqueda: string = '';

  libroSeleccionado: any = null;

  constructor(private libroService: LibroService,  private router: Router) {}

  ngOnInit(): void {
    this.obtenerLibrosDisponibles();
  }

  obtenerLibrosDisponibles() {
    this.loading = true;
    this.error = '';
    this.libroService.getTodosLosLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.librosFiltrados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando libros', err);
        this.error = 'Error al cargar libros. Por favor, inténtalo nuevamente más tarde.';
        this.loading = false;
      }
    });
  }
  

  filtrarLibros() {
    const term = this.busqueda.trim().toLowerCase();
    if (term === '') {
      this.librosFiltrados = this.libros; // Mostrar todos si no hay búsqueda
    } else {
      this.librosFiltrados = this.libros.filter(libro =>
        libro.titulo.toLowerCase().includes(term) ||
        libro.autor.toLowerCase().includes(term)
      );
    }
  }

  verDetalles(libro: any) {
    this.libroSeleccionado = libro;
  }

  cerrarModal() {
    this.libroSeleccionado = null;
  }
  
  redirigirRegistroPrestamo(libro: any) {
    this.router.navigate(['/prestamos'], { 
      queryParams: { 
        isbn: libro.isbn,
        titulo: libro.titulo
      } 
    });
  }
}
