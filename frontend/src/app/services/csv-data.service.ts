import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CsvDatasetResponse } from '../models/csv-dataset-response';
import { CsvDataset } from '../models/csv-dataset';

@Injectable({
    providedIn: 'root'
})
export class CsvDataService {

    private baseUrl = 'http://localhost:3000/api/users';

    constructor(private http: HttpClient) { }

    getAllCsvById(userId: number): Observable<CsvDatasetResponse> {
        return this.http.get<CsvDatasetResponse>(`${this.baseUrl}/${userId}/csv-datasets/`, {
            withCredentials: true
        }).pipe(
            catchError(this.handleError)
        );
    }

    getCsvById(userId: number, CsvDatasetId: number): Observable<CsvDatasetResponse> {
        return this.http.get<CsvDatasetResponse>(`${this.baseUrl}/${userId}/csv-datasets/${CsvDatasetId}`, {
            withCredentials: true
        }).pipe(
            catchError(this.handleError)
        );
    }

    createCsv(userId: number, csvDataset: CsvDataset): Observable<CsvDatasetResponse> {
        return this.http.post<CsvDatasetResponse>(`${this.baseUrl}/${userId}/csv-datasets/`, csvDataset, {
            withCredentials: true
        }).pipe(
            catchError(this.handleError)
        );
    }

    updateCsv(userId: number, CsvDataSetId: number, csvDataSet: CsvDataset): Observable<CsvDatasetResponse> {
        return this.http.put<CsvDatasetResponse>(`${this.baseUrl}/${userId}/csv-datasets/${CsvDataSetId}`, csvDataSet, {
            withCredentials: true
        }).pipe(
            catchError(this.handleError)
        );
    }

    deleteCsv(userId: number, csvDataSetId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${userId}/CsvDataSets/${csvDataSetId}`, {
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