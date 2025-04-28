import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- IMPORTANTE

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule], // <-- AQUIIIII
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent { }
