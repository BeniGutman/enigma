export class User {
  constructor(
    private _id: number,
    private _userName: string,
    private _email: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    private _refreshToken: string
  ) {}

  get id() {
    return this._id;
  }

  get userName() {
    return this._userName;
  }

  get email() {
    return this._email;
  }

  get token() {
    return this._token;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  public isTokenValid() {
    if (new Date() > this._tokenExpirationDate) {
      return false;
    }
    return true;
  }
}
