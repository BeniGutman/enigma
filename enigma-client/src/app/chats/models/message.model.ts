export class Message {
  constructor(
    private _id: number,
    private _sender: string,
    private _text: string
  ) {}

  get id(): number {
    return this._id;
  }

  get sender(): string {
    return this._sender;
  }

  get text(): string {
    return this._text;
  }
}
