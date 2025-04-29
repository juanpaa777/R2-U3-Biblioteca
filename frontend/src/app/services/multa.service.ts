import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultaService {

  private apiUrl = 'http://localhost:5000/api/multas'; // 👈 Asegúrate de que tu backend lo tenga

  constructor(private http: HttpClient) {}

  // 👉 Obtener todas las multas
  getMultas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 👉 Crear una nueva multa (opcional, si quieres desde frontend)
  crearMulta(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
