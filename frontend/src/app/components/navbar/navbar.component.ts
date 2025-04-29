import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  toastMessage = '';
  isErrorToast = false;
  mostrarLogin = false;

  // ✅ Esta propiedad es la que faltaba
  isLoggedIn = false;

  credenciales = {
    usuario: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  login() {
    this.http.post<any>('http://localhost:5000/api/login', this.credenciales)
      .subscribe({
        next: (res) => {
          alert('✅ Login exitoso');
          this.isLoggedIn = true;         // 🔑 Activar secciones protegidas
          this.mostrarLogin = false;
        },
        error: (err) => {
          alert('❌ Error de login: ' + (err.error.message || 'Error desconocido'));
        }
      });
  }

  // ✅ Este método también faltaba
  cerrarSesion() {
    this.isLoggedIn = false;
    this.toastMessage = 'Sesión cerrada.';
  }
}
