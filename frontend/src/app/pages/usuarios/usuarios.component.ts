import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  usuariosAnimados: any[] = [];
  usuariosFiltrados: any[] = [];

  nuevoUsuario = {
    matricula: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  };

  editandoUsuario: any = null;
  usuarioSeleccionado: any = null;

  mostrarModalRegistro: boolean = false;
  mensaje: string = '';
  terminoBusqueda: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.obtenerUsuariosAnimado();
  }

  obtenerUsuariosAnimado() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = [];
        setTimeout(() => {
          this.usuarios = data;
          this.usuariosAnimados = this.usuarios.map(u => ({ ...u, fade: true }));
          setTimeout(() => {
            this.usuariosAnimados = this.usuariosAnimados.map(u => ({ ...u, fade: false }));
          }, 600);
        }, 200);
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  registrarUsuario() {
    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.mensaje = 'Usuario registrado correctamente';
        this.nuevoUsuario = { matricula: '', nombre: '', apellido: '', correo: '', telefono: '' };
        this.cerrarModalRegistro();
        this.obtenerUsuariosAnimado();
      },
      error: (err) => {
        this.mensaje = err.error.message || 'Error al registrar usuario';
      }
    });
  }

  seleccionarUsuario(usuario: any) {
    this.editandoUsuario = { ...usuario };
  }

  guardarEdicion() {
    this.usuarioService.actualizarUsuario(this.editandoUsuario._id, this.editandoUsuario).subscribe({
      next: () => {
        this.mensaje = 'Usuario actualizado correctamente';
        this.editandoUsuario = null;
        this.obtenerUsuariosAnimado();
      },
      error: (err) => {
        this.mensaje = err.error.message || 'Error al actualizar usuario';
      }
    });
  }

  cancelarEdicion() {
    this.editandoUsuario = null;
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.mensaje = 'Usuario eliminado correctamente';
          this.obtenerUsuariosAnimado();
        },
        error: (err) => {
          this.mensaje = err.error.message || 'Error al eliminar usuario';
        }
      });
    }
  }

  abrirModalRegistro() {
    this.mostrarModalRegistro = true;
  }

  cerrarModalRegistro() {
    this.mostrarModalRegistro = false;
  }

  mostrarModal(usuario: any) {
    this.usuarioSeleccionado = usuario;
  }

  cerrarModal() {
    this.usuarioSeleccionado = null;
  }

  filtrarUsuarios() {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (termino === '') {
      this.usuariosFiltrados = [];
    } else {
      this.usuariosFiltrados = this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.apellido.toLowerCase().includes(termino) ||
        usuario.matricula.toLowerCase().includes(termino) ||
        usuario.correo.toLowerCase().includes(termino) ||
        usuario.telefono.toLowerCase().includes(termino)
      );
    }
  }

  verTodos() {
    this.terminoBusqueda = '';
    this.usuariosFiltrados = [];
  }
  usuarioSeleccionadoBusqueda: any = null;
  @ViewChild('tablaUsuarios') tablaUsuarios!: ElementRef;


  seleccionarDesdeBusqueda(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.terminoBusqueda = '';
    this.usuariosFiltrados = [];
  }
  editarDesdeModal() {
    this.editandoUsuario = { ...this.usuarioSeleccionado };
    this.usuarioSeleccionado = null; // Cerrar el modal
  }
  
  eliminarDesdeModal() {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(this.usuarioSeleccionado._id).subscribe({
        next: (res) => {
          this.mensaje = 'Usuario eliminado correctamente';
          this.usuarioSeleccionado = null; // Cerrar el modal
          this.obtenerUsuariosAnimado(); // Recargar usuarios
        },
        error: (err) => {
          this.mensaje = err.error.message || 'Error al eliminar usuario';
        }
      });
    }
  }
  
}

