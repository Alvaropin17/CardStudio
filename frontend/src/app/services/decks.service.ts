import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { Deck } from '../models/deck';
import { CardImageResponse } from '../models/responses/deck-response';
import { UniqueCardImageResponse } from '../models/responses/unique-deck-response';

@Injectable({
    providedIn: 'root'
})
export class DecksService {

    private baseUrl = 'http://localhost:3000/api/users';

    constructor(private http: HttpClient) { }

    getAllDecksByUserId(userId: number): Observable<CardImageResponse> {
        return this.http.get<CardImageResponse>(`${this.baseUrl}/${userId}/decks`, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    getDecksById(userId: number, imageId: number): Observable<UniqueCardImageResponse> {
        return this.http.get<UniqueCardImageResponse>(`${this.baseUrl}/${userId}/decks/${imageId}`, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    createDeck(userId: number, deckData: any): Observable<UniqueCardImageResponse> {
        return this.http.post<UniqueCardImageResponse>(`${this.baseUrl}/${userId}/decks`, deckData, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    updateDeck(userId: number, imageId: number, image: Deck): Observable<UniqueCardImageResponse> {
        return this.http.put<UniqueCardImageResponse>(`${this.baseUrl}/${userId}/decks/${imageId}`, image, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    deleteDeck(userId: number, imageId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${userId}/decks/${imageId}`, {
            withCredentials: true
        }).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        const message = error.error?.message || 'Error en la comunicación con el servidor';
        return throwError(() => new Error(message));
    }
}
