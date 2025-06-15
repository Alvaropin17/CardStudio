import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { TemplatesResponse } from '../models/responses/template-response';
import { UniqueTemplateResponse } from '../models/responses/unique-template-response';
import { Template } from '../models/template';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  private baseUrl = 'https://localhost:8443/api/users';

  constructor(private http: HttpClient) {}

  getAllTemplatesById(userId: number): Observable<TemplatesResponse> {
    return this.http.get<TemplatesResponse>(`${this.baseUrl}/${userId}/templates/`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  getTemplateById(userId: number, templateId: number): Observable<UniqueTemplateResponse> {
    return this.http.get<UniqueTemplateResponse>(`${this.baseUrl}/${userId}/templates/${templateId}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  createTemplate(userId: number, template: Template): Observable<UniqueTemplateResponse> {
    return this.http.post<UniqueTemplateResponse>(`${this.baseUrl}/${userId}/templates/`, template, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  assignCsvToTemplate(userId: number, templateId: number, csvId: number): Observable<UniqueTemplateResponse> {
    return this.http.post<UniqueTemplateResponse>(`${this.baseUrl}/${userId}/templates/${templateId}/csv/${csvId}`, {}, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateTemplate(userId: number, templateId: number, template: Template): Observable<UniqueTemplateResponse> {
    return this.http.put<UniqueTemplateResponse>(`${this.baseUrl}/${userId}/templates/${templateId}`, template, {
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
