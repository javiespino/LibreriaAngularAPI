import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export type Role = 'user' | 'admin';

export interface User {
  id:       number;
  username: string;
  role:     Role;
  token:    string;
}

interface AuthResponse {
  token:    string;
  username: string;
  role:     string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'https://localhost:7101/api/Auth';
  private http = inject(HttpClient);

  private currentUserSignal = signal<User | null>(
    JSON.parse(sessionStorage.getItem('user') || 'null')
  );

  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn  = computed(() => !!this.currentUserSignal());
  isAdmin     = computed(() => this.currentUserSignal()?.role === 'admin');
  isUser      = computed(() => this.currentUserSignal()?.role === 'user');

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponse>(`${this.API}/login`, { username, password }).pipe(
      tap(res => {
        const decoded = this.decodeToken(res.token);
        const id = Number(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
        const user: User = { id, username: res.username, role: res.role as Role, token: res.token };
        this.currentUserSignal.set(user);
        sessionStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.API}/register`, { username, email, password });
  }

  logout() {
    this.currentUserSignal.set(null);
    sessionStorage.removeItem('user');
  }

  getToken() {
    return this.currentUserSignal()?.token ?? null;
  }
}