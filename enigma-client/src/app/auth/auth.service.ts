import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import * as config from '../../assets/config.json';

export interface LoginResponseData {
  userId: number;
  userName: string;
  email: string;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  conf = config;

  register(email: string, userName: string, password: string) {
    return this.http
      .post(this.conf.webApiUrl + 'auth/register', {
        email: email,
        userName: userName,
        password: password,
      })
      .pipe(catchError(this.handleError));
  }

  login(userName: string, password: string) {
    return this.http
      .post<LoginResponseData>(this.conf.webApiUrl + 'auth/login', {
        userName: userName,
        password: password,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    errorMessage = errorRes.error.error;
    return throwError(errorMessage);
  }
}
