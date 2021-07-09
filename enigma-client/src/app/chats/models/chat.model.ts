import { Message } from './message.model';

export abstract class Chat {
  isMessagesInitialized: boolean = false;
  constructor(
    protected _id: number,
    protected _isGroup: boolean,
    protected _messages: Message[]
  ) {}

  get id(): number {
    return this._id;
  }

  get isGroup(): boolean {
    return this._isGroup;
  }

  get messages(): Message[] {
    return this._messages;
  }

  abstract getName(): string;
}
