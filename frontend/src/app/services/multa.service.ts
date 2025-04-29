import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultaService {
  private apiUrl = 'http://localhost:5000/api/multas';

  constructor(private http: HttpClient) {}

  // Obtener todas las multas
  getMultas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear nueva multa
  crearMulta(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Pagar una multa
  pagarMulta(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/pagar`, {});
  }
}
