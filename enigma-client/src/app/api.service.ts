import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as config from '../assets/config.json';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  conf = config;
  constructor(private http: HttpClient) {}

  private printError(error: any) {
    console.log(error);
    return throwError(error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(this.conf.webApiUrl + path, { params })
      .pipe(catchError(this.printError));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(this.conf.webApiUrl + path, { ...body })
      .pipe(catchError(this.printError));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(this.conf.webApiUrl + path, { ...body })
      .pipe(catchError(this.printError));
  }

  delete(path: string): Observable<any> {
    return this.http
      .delete(this.conf.webApiUrl + path)
      .pipe(catchError(this.printError));
  }
}
