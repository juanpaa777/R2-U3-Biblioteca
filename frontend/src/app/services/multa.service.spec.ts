import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultaService {

  private apiUrl = 'http://localhost:5000/api/multas';

  constructor(private http: HttpClient) { }

  getMultas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
