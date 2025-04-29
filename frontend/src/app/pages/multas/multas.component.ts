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
  loading = true;
  error = '';

  constructor(private multaService: MultaService) {}

  ngOnInit(): void {
    this.cargarMultas();
  }

  cargarMultas(): void {
    this.loading = true;
    this.error = '';
    this.multaService.getMultas().subscribe({
      next: data => {
        this.multas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar multas';
        this.loading = false;
      }
    });
  }

  pagarMulta(multa: any): void {
    multa.pagando = true;
    setTimeout(() => {
      this.multaService.pagarMulta(multa._id).subscribe({
        next: () => {
          multa.pagada = true;
          multa.pagando = false;
          alert('✅ Multa pagada y usuario actualizado');
        },
        error: () => {
          multa.pagando = false;
          alert('❌ Error al pagar la multa');
        }
      });
    }, 2000); // Simula pantalla de carga
  }
}
