import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private apiUrl = 'http://localhost:5000/api/prestamos';

  constructor(private http: HttpClient) {}

  crearPrestamo(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  devolverPrestamo(prestamoId: string, payload: { condicion: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/devolver/${prestamoId}`, payload);
  }

  getAllPrestamos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`); // /api/prestamos
  }
  getPrestamosActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos`);
  }
}
