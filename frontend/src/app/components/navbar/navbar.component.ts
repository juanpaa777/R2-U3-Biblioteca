import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  mostrarLogin = false;
  isLoggedIn = false;

  constructor() {}

  ngOnInit(): void {
    // Verificar el estado de inicio de sesión almacenado en localStorage
    const loginGuardado = localStorage.getItem('isLoggedIn');
    this.isLoggedIn = loginGuardado === 'true';
    
    // Verificar que Font Awesome esté cargado
    console.log('Font Awesome disponible:', !!document.querySelector('link[href*="font-awesome"]'));
  }

  modalLoginCerrado() {
    this.mostrarLogin = false;
  }

  loginCompletado() {
    this.isLoggedIn = true;
    this.mostrarLogin = false;
    localStorage.setItem('isLoggedIn', 'true');
  }

  cerrarSesion() {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    alert('Sesión cerrada');
  }
}