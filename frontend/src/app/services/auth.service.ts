import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(user: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { user, password }, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // NEEDS TO BE IMPLEMENTED IN BACKEND
  checkAuth(): Observable<User> {
    return this.http.get<{ authenticated: boolean, user: User }>(`${this.baseUrl}/check`, {
      withCredentials: true
    }).pipe(
      map(res => res.user),
      catchError(this.handleError)
    );
  }

  // NEEDS TO BE IMPLEMENTED IN BACKEND
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || 'Error en la comunicación con el servidor';
    return throwError(() => new Error(message));
  }
}
