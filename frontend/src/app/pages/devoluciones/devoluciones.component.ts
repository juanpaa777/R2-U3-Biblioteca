import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PrestamoService } from '../../services/prestamo.service';

@Component({
  selector: 'app-devoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.css']
})
export class DevolucionesComponent implements OnInit {

  prestamos: any[] = [];
  prestamosFiltrados: any[] = [];
  prestamosDevueltos: string[] = [];
  audio = new Audio('assets/sounds/ding.mp3');
  showConfirmModal = false;
  confirmMessage = '';

  terminoBusqueda = '';
  fechaDesde: string = '';
  fechaHasta: string = '';
  tipoFecha: 'prestamo' | 'devolucion' = 'prestamo';
  filtroEstado: 'todos' | 'vigente' | 'devuelto' | 'retrasado' = 'todos';

  condicionSeleccionada = 'Bueno';
  prestamoSeleccionado: any = null;

  loading = false;
  showModal = false;
  modalMessage = '';
  isError = false;

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    this.cargarTodos();
  }

  cargarTodos(): void {
    this.loading = true;
    this.prestamoService.getAllPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  aplicarFiltros(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    const desde = this.fechaDesde ? new Date(this.fechaDesde) : null;
    const hasta = this.fechaHasta ? new Date(this.fechaHasta) : null;
  
    this.prestamosFiltrados = this.prestamos
      .filter(p => {
        if (this.filtroEstado === 'todos') return true;
  
        if (this.filtroEstado === 'retrasado') {
          // Sólo mostrar préstamos que estén vigentes y vencidos (no devueltos)
          return p.estado === 'vigente' && new Date(p.fechaVencimiento) < new Date();
        }
  
        return p.estado === this.filtroEstado;
      })
      .filter(p => {
        if (!termino) return true;
        return p.usuarioId?.nombre.toLowerCase().includes(termino)
            || p.usuarioId?.apellido.toLowerCase().includes(termino)
            || p.libroId?.titulo.toLowerCase().includes(termino);
      })
      .filter(p => {
        const fecha = this.tipoFecha === 'prestamo'
          ? new Date(p.fechaPrestamo)
          : (p.fechaDevolucion ? new Date(p.fechaDevolucion) : null);
        if (!fecha) return false;
        if (desde && fecha < desde) return false;
        if (hasta && fecha > hasta) return false;
        return true;
      });
  }
  

  abrirModalDevolucion(prestamo: any): void {
    this.prestamoSeleccionado = prestamo;
    this.condicionSeleccionada = 'Bueno';
    this.showModal = true;
  }

  confirmarDevolucion(): void {
    if (!this.prestamoSeleccionado) return;
  
    this.loading = true;
    this.prestamoService.devolverPrestamo(this.prestamoSeleccionado._id, { condicion: this.condicionSeleccionada })
      .subscribe({
        next: ({ prestamo }) => {
          this.prestamosDevueltos.push(prestamo._id);
          this.loading = false;
          this.showModal = false;
  
          this.confirmMessage = (prestamo.estado === 'retrasado' && prestamo.multa > 0)
            ? `⚠️ Devolución con multa: $${prestamo.multa}`
            : `✅ El libro "${prestamo.libroId?.titulo}" fue devuelto exitosamente`;
  
          this.audio.play().catch(() => {});
          this.showConfirmModal = true;
  
          this.cargarTodos();
        },
        error: (err) => {
          this.loading = false;
          this.showModal = false;
          this.confirmMessage = err?.error?.message || '❌ Error al registrar la devolución.';
          this.isError = true;
          this.audio.play().catch(() => {});
          this.showConfirmModal = true;
        }
      });
  }
  
  cerrarModal(): void {
    this.showModal = false;
    this.prestamoSeleccionado = null;
  }

  estaVencido(prestamo: any): boolean {
    if (prestamo.estado === 'devuelto') return false;
    return new Date() > new Date(prestamo.fechaVencimiento);
  }
}
