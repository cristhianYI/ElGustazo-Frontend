import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.id.toString());
        localStorage.setItem('username', res.username);
        localStorage.setItem('rol', res.rol);
      })
    );
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  getUserId(): number { return Number(localStorage.getItem('userId')) || 0; }
  getUsername(): string { return localStorage.getItem('username') || ''; }
  getRol(): string { return localStorage.getItem('rol') || ''; }
  isAdmin(): boolean { return this.getRol() === 'ADMIN'; }
  isLoggedIn(): boolean { return !!this.getToken(); }
}
