import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  login(nome: string, senha: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { nome, senha }).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
