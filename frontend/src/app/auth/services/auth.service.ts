import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map, tap, BehaviorSubject } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { RegisterResponse } from '../models/register-response';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/api/auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasUser());
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  private hasUser(): boolean {
    return !!localStorage.getItem('user');
  }

  login(user: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { user, password }, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        localStorage.setItem('user', JSON.stringify(response.body));
        this.isLoggedInSubject.next(true); 

      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        localStorage.removeItem('user');
        this.isLoggedInSubject.next(false);
      }),
      catchError(this.handleError)
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

