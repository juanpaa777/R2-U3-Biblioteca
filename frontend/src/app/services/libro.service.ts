import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private apiUrl = 'http://localhost:5000/api/libros';

  constructor(private http: HttpClient) { }

  getTodosLosLibros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
