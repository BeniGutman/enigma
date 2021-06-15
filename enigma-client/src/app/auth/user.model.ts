export class User {
    constructor(
      private _id: number,
      private _userName: string,
      private _email: string
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
  }
  