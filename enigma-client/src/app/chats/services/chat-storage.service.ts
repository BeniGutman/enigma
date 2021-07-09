import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatStorageService {
  private chats: Map<number, Chat> = new Map<number, Chat>();
  chatChanged = new Subject<Chat>();
  constructor() {}

  getChats(): Chat[] {
    return Array.from(this.chats.values());
  }

  setChats(chats: Chat[]) {
    chats.forEach((chat) => {
      this.chats.set(chat.id, chat);
      this.chatChanged.next(chat);
      console.log('next new chat, type: ' + typeof chat);
    });
  }

  getChat(chatId: number): Chat | undefined {
    const chat = this.chats.get(chatId);
    if (!chat) {
      return;
    }

    if (!chat.isMessagesInitialized) {
      // TODO: async get data from server
    }
    return chat;
  }

  setChatMessages(chatId: number, messages: Message[]) {
    const chat = this.chats.get(chatId);
    chat!.messages.push(...messages);
  }
}
