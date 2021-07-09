import { Chat } from './chat.model';
import { Message } from './message.model';

export class Group extends Chat {
  constructor(
    protected _id: number,
    protected _name: string,
    protected _members: string[],
    protected _messages: Message[]
  ) {
    super(_id, true, _messages);
  }

  get members(): string[] {
    return this._members;
  }

  getName(): string {
    return this._name;
  }
}
