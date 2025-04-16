import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth/login';
  
  constructor(private http: HttpClient) {}

  login(user: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { user, password }).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message || 'Error en el servidor';
        return throwError(() => new Error(message));
      })
    );
  }
  
}