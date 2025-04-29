import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultaService } from '../../services/multa.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-multas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './multas.component.html',
  styleUrls: ['./multas.component.css']
})

export class MultasComponent implements OnInit {

  multas: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private multaService: MultaService) {}

  ngOnInit(): void {
    this.cargarMultas();
  }

  cargarMultas() {
    this.multaService.getMultas().subscribe({
      next: (data) => {
        this.multas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar multas';
        this.loading = false;
      }
    });
  }
}
