import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as config from '../assets/config.json';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http
      .get(config.webApiUrl + path, { params })
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body: Object = {}): Observable<T> {
    return this.http
      .put(config.webApiUrl + path, { body })
      .pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http
      .post(config.webApiUrl + path, { body })
      .pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete(config.webApiUrl + path)
      .pipe(catchError(this.formatErrors));
  }
}
