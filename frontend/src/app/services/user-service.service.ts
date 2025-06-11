import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { User } from '../models/user';
import { UserResponse } from '../models/responses/user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getOneUserById(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${userId}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(userId: number, user: any): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/${userId}`, user, {
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
