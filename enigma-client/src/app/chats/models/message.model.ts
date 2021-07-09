export class Message {
  constructor(
    private _id: number,
    private _sender: string,
    private _text: string
  ) {}

  get id(): number {
    return this.id;
  }

  get sender(): string {
    return this.sender;
  }

  get text(): string {
    return this.text;
  }
}
