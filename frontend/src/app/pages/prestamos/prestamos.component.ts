import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrestamoService } from '../../services/prestamo.service';
import { UsuarioService } from '../../services/usuario.service';
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
  mensajeExito: boolean = false; // bandera para modal éxito
  isbnBloqueado: boolean = false;
  tituloLibro: string = '';
  prestamosActivos: any[] = [];

  usuarios: any[] = [];
  sugerencias: any[] = [];
  terminoBusqueda: string = '';
  audio = new Audio('assets/sounds/ding.mp3');

  constructor(
    private prestamoService: PrestamoService,
    private usuarioService: UsuarioService,
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

    this.cargarUsuarios();
    this.cargarPrestamosActivos();
  }

  registrarPrestamo() {
    const datos = { matricula: this.matricula, isbn: this.isbn };
    this.prestamoService.crearPrestamo(datos).subscribe({
      next: (res) => {
        this.mensaje = 'Préstamo registrado con éxito';
        this.audio.play().catch(() => {});
        this.mensajeExito = true; // mostrar modal éxito
        this.limpiarBusqueda();
        if (!this.isbnBloqueado) {
          this.isbn = '';
        }
        this.cargarPrestamosActivos();
      },
      error: (err) => {
        this.mensaje = err.error.message || 'Ocurrió un error al registrar el préstamo.';
      }
    });
  }

  cerrarModal() {
    // Agrega clase para animar salida
    const overlay = document.querySelector('.modal-exito');
    if (overlay) overlay.classList.add('closing');
  
    // Espera a que termine la animación antes de ocultar
    setTimeout(() => {
      this.mensajeExito = false;
      this.mensaje = '';
    }, 200); // igual al duration de modalOut
  }
  

  cargarPrestamosActivos() {
    this.prestamoService.getPrestamosActivos().subscribe({
      next: (data) => {
        this.prestamosActivos = data;
      },
      error: (err) => {
        console.error('Error al cargar préstamos activos', err);
      }
    });
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  buscarSugerencias() {
    const termino = this.terminoBusqueda.toLowerCase();
    if (termino.length > 0) {
      this.sugerencias = this.usuarios.filter(u => 
        u.nombre.toLowerCase().includes(termino) ||
        u.apellido.toLowerCase().includes(termino) ||
        u.matricula.toLowerCase().includes(termino)
      ).slice(0, 5);
    } else {
      this.sugerencias = [];
    }
  }

  seleccionarUsuario(usuario: any) {
    this.matricula = usuario.matricula;
    this.terminoBusqueda = `${usuario.nombre} ${usuario.apellido} (${usuario.matricula})`;
    this.sugerencias = [];
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.matricula = '';
    this.sugerencias = [];
  }
}
