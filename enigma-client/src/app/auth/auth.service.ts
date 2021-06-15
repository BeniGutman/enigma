import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import * as config from '../../assets/config.json';

export interface LoginResponseData {
  userId: number;
  userName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

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
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.userId,
            resData.userName,
            resData.email
          );
        })
      );
  }

  private handleAuthentication(
    userId: number,
    userName: string,
    email: string
  ) {
    // const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(userId, userName, email);
    this.user.next(user);
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
