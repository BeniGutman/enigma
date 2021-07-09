import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import * as config from '../../assets/config.json';

interface LoginResponseData {
  userId: number;
  userName: string;
  email: string;
  token: string;
  expiresIn: number;
  refreshToken: string;
}

interface RefreshTokenResponseData {
  accessToken: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}
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
            resData.email,
            resData.token,
            resData.expiresIn,
            resData.refreshToken
          );
        })
      );
  }

  refreshTheToken(refreshToken: string, navigateHome: boolean = false) {
    this.http
      .post<RefreshTokenResponseData>(this.conf.webApiUrl + 'auth/token', {
        token: refreshToken,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleRefreshToken(resData.accessToken, resData.expiresIn);
        })
      )
      .subscribe((resData) => {
        if (navigateHome) {
          this.router.navigate(['/']);
        }
      });
  }

  autoLogin(refreshTokenIfNeed: boolean = false) {
    const userData = this.loadUserDataFromLocalStorage();
    if (!userData) {
      return;
    }
    const user = new User(
      userData._id,
      userData._userName,
      userData._email,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData._refreshToken
    );

    if (user.isTokenValid()) {
      this.user.next(user);
      this.router.navigate(['/']);
    } else if (refreshTokenIfNeed) {
      this.refreshTheToken(user.refreshToken, true);
    }
  }

  private handleAuthentication(
    userId: number,
    userName: string,
    email: string,
    token: string,
    expiresIn: number,
    refreshToken: string
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      userId,
      userName,
      email,
      token,
      expirationDate,
      refreshToken
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleRefreshToken(accessToken: string, expiresIn: number) {
    const userData = this.loadUserDataFromLocalStorage();
    if (!userData) {
      return;
    }
    const user = new User(
      userData._id,
      userData._userName,
      userData._email,
      accessToken,
      new Date(expiresIn),
      userData._refreshToken
    );

    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleRefreshTokenError(errorRes: HttpErrorResponse) {
    if (
      errorRes.error &&
      errorRes.error.error &&
      errorRes.error.error === 'token not valid'
    ) {
      this.user.next(null);
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    errorMessage = errorRes.error.error;
    return throwError(errorMessage);
  }

  private loadUserDataFromLocalStorage() {
    const jsonUserData = localStorage.getItem('userData');
    if (!jsonUserData) {
      return null;
    }
    const userData: {
      _id: number;
      _userName: string;
      _email: string;
      _token: string;
      _tokenExpirationDate: string;
      _refreshToken: string;
    } = JSON.parse(jsonUserData);
    return userData;
  }
}
