import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrestamoService } from '../../services/prestamo.service';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})

export class PrestamosComponent implements OnInit {
  @Output() prestamoExitoso = new EventEmitter<void>();

  @Input() isbnInput: string = '';  // <<< recibe ISBN
  @Input() tituloInput: string = ''; // <<< recibe Título

  matricula: string = '';
  isbn: string = '';
  mensaje: string = '';
  mensajeExito: boolean = false;
  isbnBloqueado: boolean = false;
  tituloLibro: string = '';
  prestamosActivos: any[] = [];

  usuarios: any[] = [];
  sugerencias: any[] = [];
  terminoBusqueda: string = '';
  audio = new Audio('assets/sounds/ding.mp3');

  constructor(
    private prestamoService: PrestamoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    if (this.isbnInput) {
      this.isbn = this.isbnInput;
      this.isbnBloqueado = true;
    }
    if (this.tituloInput) {
      this.tituloLibro = this.tituloInput;
    }

    this.cargarUsuarios();
    this.cargarPrestamosActivos();
  }

  registrarPrestamo() {
    const datos = { matricula: this.matricula, isbn: this.isbn };
    this.prestamoService.crearPrestamo(datos).subscribe({
      next: (res) => {
        this.mensaje = 'Préstamo registrado con éxito';
        this.audio.play().catch(() => {});
        this.mensajeExito = true;
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
    const overlay = document.querySelector('.modal-exito');
    if (overlay) overlay.classList.add('closing');
  
    setTimeout(() => {
      this.mensajeExito = false;
      this.mensaje = '';
      this.prestamoExitoso.emit();  // <<< 🔥 Lanza evento para avisar que terminó
    }, 200);
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
