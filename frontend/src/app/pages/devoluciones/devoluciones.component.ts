import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrestamoService } from '../../services/prestamo.service';

@Component({
  selector: 'app-devoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.css']
})
export class DevolucionesComponent implements OnInit {

  prestamosActivos: any[] = [];
  prestamosFiltrados: any[] = [];
  mensaje: string = '';
  terminoBusqueda: string = '';
  loading: boolean = false;
  prestamosDevueltos: string[] = [];
  condicion: string = 'Bueno'; 

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    this.cargarPrestamosActivos();
  }

  cargarPrestamosActivos() {
    this.loading = true;
    this.prestamoService.getPrestamosActivos().subscribe({
      next: (data) => {
        this.prestamosActivos = data;
        this.prestamosFiltrados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar préstamos activos', err);
        this.loading = false;
      }
    });
  }
  filtrarPrestamos() {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (termino === '') {
      this.prestamosFiltrados = this.prestamosActivos;
    } else {
      this.prestamosFiltrados = this.prestamosActivos.filter(prestamo => 
        (prestamo.usuarioId?.nombre?.toLowerCase().includes(termino) ||
         prestamo.usuarioId?.apellido?.toLowerCase().includes(termino) ||
         prestamo.libroId?.titulo?.toLowerCase().includes(termino))
      );
    }
  }

  devolverPrestamo(prestamoId: string) {
    const payload = { condicion: this.condicion };
    
    this.loading = true;
    this.prestamoService.devolverPrestamo(prestamoId, payload).subscribe({
      next: (res) => {
        this.prestamosDevueltos.push(prestamoId);
        this.mostrarToast('✅ Devolución registrada con éxito');
        setTimeout(() => {
          this.loading = false;
          this.cargarPrestamosActivos();
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.mostrarToast(err.error.message || '❌ Ocurrió un error al registrar la devolución. Por favor verifica la información.', true);
      }
    });
  }
  toastMessage: string = '';
mostrarToast(mensaje: string, error: boolean = false) {
  this.toastMessage = mensaje;
  setTimeout(() => {
    this.toastMessage = '';
  }, 3000); // 3 segundos visible
}
  
  estaVencido(prestamo: any): boolean {
    const hoy = new Date();
    const vencimiento = new Date(prestamo.fechaVencimiento);
    return hoy > vencimiento;
  }
}
