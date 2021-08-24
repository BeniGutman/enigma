import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { map, tap } from 'rxjs/operators';

import { ApiService } from '../../api.service';
import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';
import { GroupService } from './group.service';
import { PrivateChatService } from './private-chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private apiService: ApiService,
    private groupService: GroupService,
    private privateChatService: PrivateChatService
  ) {}

  getAllChats(): Observable<Chat[]> {
    return forkJoin({
      groups: this.groupService.getAllGroups(),
      privateChats: this.privateChatService.getAllPrivateChats(),
    }).pipe(
      map((results) => {
        return [...results.groups, ...results.privateChats];
      })
    );
  }

  getAllMessages(chatId: number): Observable<Message[]> {
    return this.apiService.get(`chats/${chatId}/messages`).pipe(
      map((results: any) => {
        const messages = results.map((result: any) => {
          return new Message(result.id, result.sender.userName, result.message);
        });
        return messages;
      })
    );
  }

  sendMessage(chatId: number, messageText: string) {
    return this.apiService.post(`chats/${chatId}/messages`, {
      message: messageText,
    });
  }
}
