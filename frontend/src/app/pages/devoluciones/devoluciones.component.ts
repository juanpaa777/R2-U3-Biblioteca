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

  prestamosActivos: any[] = [];
  prestamosFiltrados: any[] = [];
  terminoBusqueda = '';
  loading = false;
  prestamosDevueltos: string[] = [];
  condicion = 'Bueno';

  showModal = false;
  modalMessage = '';
  isError = false;

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    this.cargarPrestamosActivos();
  }

  cargarPrestamosActivos(): void {
    this.loading = true;
    this.prestamoService.getPrestamosActivos().subscribe({
      next: data => {
        this.prestamosActivos = data;
        this.prestamosFiltrados = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filtrarPrestamos(): void {
    const t = this.terminoBusqueda.toLowerCase().trim();
    this.prestamosFiltrados = t
      ? this.prestamosActivos.filter(p =>
          p.usuarioId?.nombre?.toLowerCase().includes(t) ||
          p.usuarioId?.apellido?.toLowerCase().includes(t) ||
          p.libroId?.titulo?.toLowerCase().includes(t)
        )
      : [...this.prestamosActivos];
  }

  devolverPrestamo(prestamoId: string): void {
    this.loading = true;
    this.prestamoService.devolverPrestamo(prestamoId, { condicion: this.condicion })
      .subscribe({
        next: ({ prestamo }) => {
          this.prestamosDevueltos.push(prestamoId);

          if (prestamo.estado === 'retrasado' && prestamo.multa > 0) {
            this.modalMessage = `⚠️ Fuera de plazo. Multa: $${prestamo.multa}`;
          } else {
            this.modalMessage = '✅ Devolución registrada con éxito';
          }
          this.isError = false;
          this.loading = false;
          this.showModal = true;
        },
        error: err => {
          this.loading = false;
          this.modalMessage = err.error?.message || '❌ Error al registrar la devolución.';
          this.isError = true;
          this.showModal = true;
        }
      });
  }

  cerrarModal(): void {
    this.showModal = false;
  }

  estaVencido(prestamo: any): boolean {
    return new Date() > new Date(prestamo.fechaVencimiento);
  }
}
