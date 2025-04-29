  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { HttpClientModule } from '@angular/common/http';
  import { Router } from '@angular/router';

  import { LibroService } from '../../services/libro.service';
  import { PrestamosComponent } from '../prestamos/prestamos.component';


  @Component({
    selector: 'app-catalogo',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, PrestamosComponent],
    templateUrl: './catalogo.component.html',
    styleUrls: ['./catalogo.component.css']
  })
  export class CatalogoComponent implements OnInit {

    libros: any[] = [];
    librosFiltrados: any[] = [];
    loading: boolean = false;
    error: string = '';
    busqueda: string = '';
    filtroTipo: string = 'Todos';
    filtroCategoria: string = 'Todos';
    anioDesde: string = '';
    anioHasta: string = '';
    categorias: string[] = [];

    libroSeleccionado: any = null;
    mostrarModalPrestamos: boolean = false; // Para mostrar PrestamosComponent en modal
    // 🔥🔥 Variables NUEVAS que debes agregar
 
    filtroAnioDesde: number | null = null;
    filtroAnioHasta: number | null = null;
    categoriasDisponibles: string[] = [];  // <<-- Se llena dinámicamente

    constructor(private libroService: LibroService, private router: Router) {}

    ngOnInit(): void {
      this.obtenerLibrosDisponibles();
    }
  
    obtenerLibrosDisponibles() {
      this.loading = true;
      this.libroService.getTodosLosLibros().subscribe({
        next: data => {
          this.libros = data;
          this.categorias = [...new Set(data.map(lib => lib.categoria))];
          this.filtrarLibros();
          this.loading = false;
        },
        error: err => {
          this.error = 'Error al cargar libros';
          this.loading = false;
        }
      });
    }
  
    filtrarLibros() {
      const term = this.busqueda.toLowerCase();
      const desde = this.anioDesde ? parseInt(this.anioDesde) : null;
      const hasta = this.anioHasta ? parseInt(this.anioHasta) : null;
  
      this.librosFiltrados = this.libros.filter(libro => {
        const coincideBusqueda = libro.titulo.toLowerCase().includes(term) ||
                                 libro.autor.toLowerCase().includes(term);
  
        const coincideTipo = this.filtroTipo === 'Todos' || libro.tipo === this.filtroTipo;
        const coincideCategoria = this.filtroCategoria === 'Todos' || libro.categoria === this.filtroCategoria;
  
        const anio = new Date(libro.fechaPublicacion).getFullYear();
        const coincideFecha = (!desde || anio >= desde) && (!hasta || anio <= hasta);
  
        return coincideBusqueda && coincideTipo && coincideCategoria && coincideFecha;
      });
    }
  
    verDetalles(libro: any) {
      this.libroSeleccionado = libro;
    }
  
    cerrarModal() {
      this.libroSeleccionado = null;
    }
  
    abrirModalPrestamos() {
      this.mostrarModalPrestamos = true;
    }
  
    cerrarModalPrestamos() {
      this.mostrarModalPrestamos = false;
      this.libroSeleccionado = null;
    }
  }