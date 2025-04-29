import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  mostrarLogin = false;
  isLoggedIn = false;

  credenciales = {
    usuario: '',
    password: ''
  };

  constructor(private http: HttpClient) {
    // ✅ Recuperar estado desde localStorage
    const loginGuardado = localStorage.getItem('isLoggedIn');
    this.isLoggedIn = loginGuardado === 'true';
  }

  login() {
    if (!this.credenciales.usuario || !this.credenciales.password) {
      alert('Por favor, ingresa usuario y contraseña');
      return;
    }

    this.http.post<any>('http://localhost:5000/api/login', this.credenciales)
      .subscribe({
        next: (res) => {
          this.isLoggedIn = true;
          this.mostrarLogin = false;
          localStorage.setItem('isLoggedIn', 'true');
          alert('✅ Login exitoso');
        },
        error: (err) => {
          alert('❌ Error de login: ' + (err.error.message || 'Error desconocido'));
        }
      });
  }

  cerrarSesion() {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    alert('Sesión cerrada');
  }
}
