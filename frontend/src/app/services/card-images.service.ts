import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { CardImage } from '../models/card-image';
import { CardImageResponse } from '../models/responses/card-image-response';
import { UniqueCardImageResponse } from '../models/responses/unique-card-image-response';

@Injectable({
    providedIn: 'root'
})
export class CardImagesService {

    private baseUrl = 'http://localhost:3000/api/users';

    constructor(private http: HttpClient) { }

    getAllImagesByUserId(userId: number): Observable<CardImageResponse> {
        return this.http.get<CardImageResponse>(`${this.baseUrl}/${userId}/card-images`, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    getImageById(userId: number, imageId: number): Observable<UniqueCardImageResponse> {
        return this.http.get<UniqueCardImageResponse>(`${this.baseUrl}/${userId}/card-images/${imageId}`, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    createImage(userId: number, image: CardImage): Observable<UniqueCardImageResponse> {
        return this.http.post<UniqueCardImageResponse>(`${this.baseUrl}/${userId}/card-images`, image, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    updateImage(userId: number, imageId: number, image: CardImage): Observable<UniqueCardImageResponse> {
        return this.http.put<UniqueCardImageResponse>(`${this.baseUrl}/${userId}/card-images/${imageId}`, image, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    deleteImage(userId: number, imageId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${userId}/card-images/${imageId}`, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        const message = error.error?.message || 'Error en la comunicación con el servidor';
        return throwError(() => new Error(message));
    }
}
