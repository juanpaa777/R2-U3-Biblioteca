import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrestamoService } from '../../services/prestamo.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {

  matricula: string = '';
  isbn: string = '';
  mensaje: string = '';
  isbnBloqueado: boolean = false; // Nueva propiedad para saber si bloquear o no
  tituloLibro: string = '';

  constructor(
    private prestamoService: PrestamoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['isbn']) {
        this.isbn = params['isbn'];
        this.isbnBloqueado = true;
      }
      if (params['titulo']) {
        this.tituloLibro = params['titulo'];
      }
    });
  }

  registrarPrestamo() {
    const datos = { matricula: this.matricula, isbn: this.isbn };
    this.prestamoService.crearPrestamo(datos).subscribe({
      next: (res) => {
        this.mensaje = '✅ Préstamo registrado con éxito';
        this.matricula = '';
        if (!this.isbnBloqueado) {
          this.isbn = '';
        }
      },
      error: (err) => {
        this.mensaje = err.error.message || '❌ Ocurrió un error al registrar el préstamo. Intenta nuevamente.';
      }
    });
  }
}
