import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { TemplateResponse } from '../models/template-response';
import { Template } from '../models/template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getAllTemplatesById(userId: number): Observable<TemplateResponse> {
    return this.http.get<TemplateResponse>(`${this.baseUrl}/${userId}/templates/`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  getTemplateById(userId: number, templateId: number): Observable<TemplateResponse> {
    return this.http.get<TemplateResponse>(`${this.baseUrl}/${userId}/templates/${templateId}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  createTemplate(userId: number, template: Template): Observable<TemplateResponse> {
    return this.http.post<TemplateResponse>(`${this.baseUrl}/${userId}/templates/`, template, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateTemplate(userId: number, templateId: number, template: Template): Observable<TemplateResponse> {
    return this.http.put<TemplateResponse>(`${this.baseUrl}/${userId}/templates/${templateId}`, template, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTemplate(userId: number, templateId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/templates/${templateId}`, {
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
