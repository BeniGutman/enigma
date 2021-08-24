import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatStorageService {
  chatAdded = new Subject<Chat>();
  private chats: Map<number, Chat> = new Map<number, Chat>();

  constructor(private chatService: ChatService) {}

  getChats(): Chat[] {
    return Array.from(this.chats.values());
  }

  setChats(chats: Chat[]) {
    chats.forEach((chat) => {
      this.chats.set(chat.id, chat);
      this.chatAdded.next(chat);
    });
  }

  getChat(chatId: number): Chat | undefined {
    const chat = this.chats.get(chatId);
    if (!chat!.isMessagesInitialized) {
      this.initializeChatMessages(chatId);
    }
    return chat;
  }

  initializeChatMessages(chatId: number): void {
    this.chatService.getAllMessages(chatId).subscribe((messages: Message[]) => {
      this.setChatMessages(chatId, messages);
    });
  }

  setChatMessages(chatId: number, messages: Message[]) {
    const chat = this.chats.get(chatId);
    chat!.messages.push(...messages);
    chat!.isMessagesInitialized = true;
  }
}
