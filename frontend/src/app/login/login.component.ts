import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() cerrarLogin = new EventEmitter<void>();
  @Output() loginExitoso = new EventEmitter<void>();

  credenciales = { usuario: '', password: '' };

  constructor() {}

  cerrar() {
    this.cerrarLogin.emit();
  }

  login() {
    if (!this.credenciales.usuario || !this.credenciales.password) {
      alert('Completa todos los campos');
      return;
    }

    // Simulación de login exitoso
    this.loginExitoso.emit();
    alert('✅ Login exitoso');
  }
}
  