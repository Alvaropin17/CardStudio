import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Template } from '../models/template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getAllTemplates(userId: number): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.baseUrl}/${userId}/templates/`).pipe(
      catchError(this.handleError)
    );
  }

  getTemplateById(userId: number, templateId: number): Observable<Template> {
    return this.http.get<Template>(`${this.baseUrl}/${userId}/templates/${templateId}`).pipe(
      catchError(this.handleError)
    );
  }

  createTemplate(userId: number, template: Template): Observable<Template> {
    return this.http.post<Template>(`${this.baseUrl}/${userId}/templates/`, template).pipe(
      catchError(this.handleError)
    );
  }

  updateTemplate(userId: number, templateId: number, template: Template): Observable<Template> {
    return this.http.put<Template>(`${this.baseUrl}/${userId}/templates/${templateId}`, template).pipe(
      catchError(this.handleError)
    );
  }

  deleteTemplate(userId: number, templateId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/templates/${templateId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || 'Error en la comunicación con el servidor';
    return throwError(() => new Error(message));
  }
}