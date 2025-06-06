import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { RegisterResponse } from '../models/register-response';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

login(user: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { user, password }, {
    withCredentials: true
  }).pipe(
    tap((response) => {
      localStorage.setItem('user', JSON.stringify(response.body));
    }),
    catchError(error => {
      return throwError(() => new Error(error.message));
    })
  );
}


  logout(): Observable<any> {
    return this.http.post('/api/logout', {}).pipe(
      tap(() => {
        localStorage.removeItem('user');
      }),
      catchError(error => {
        localStorage.clear(); 
        return throwError(error);
      })
    );
  }

  register(user: string, password: string, email: string): Observable<any> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, {
      user, password, email
    }).pipe(
      catchError(this.handleError)
    );
  }

  
  // TO DO: NEEDS TO BE IMPLEMENTED IN BACKEND
  checkAuth(): Observable<User> {
    return this.http.get<{ authenticated: boolean, user: User }>(`${this.baseUrl}/check`, {
      withCredentials: true
    }).pipe(
      map(res => res.user),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || 'Error en la comunicación con el servidor';
    return throwError(() => new Error(message));
  }
}
