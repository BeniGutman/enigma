import { Chat } from './chat.model';
import { Message } from './message.model';

export class PrivateChat extends Chat {
  constructor(
    protected _id: number,
    protected _messages: Message[],
    protected _otherUser: string
  ) {
    super(_id, false, _messages);
  }

  get otherUser(): string {
    return this._otherUser;
  }

  getName(): string {
    return this._otherUser;
  }
}
