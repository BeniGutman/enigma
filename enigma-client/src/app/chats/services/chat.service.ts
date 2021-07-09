import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import * as config from '../../../assets/config.json';
import { ChatStorageService } from './chat-storage.service';
import { Group } from '../models/group.model';
import { PrivateChat } from '../models/private-chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private http: HttpClient,
    private chatStorageService: ChatStorageService
  ) {}
  conf = config;

  getAllChats() {
    return this.http
      .get<{ groups: any; privateChats: any }>(this.conf.webApiUrl + 'chats')
      .pipe(
        map((result) => {
          let privateChats = result.privateChats;
          let groups = result.groups;

          groups = groups.map((group: any) => {
            return new Group(
              group.chatId,
              group.name,
              group.members,
              group.messages
            );
          });

          privateChats = privateChats.map((privateChat: any) => {
            let otherUserName = privateChat.firstUser.userName;
            if (otherUserName === 'myUserName') {
              otherUserName = privateChat.secondUser.userName;
            }
            return new PrivateChat(
              privateChat.chatId,
              privateChat.messages,
              otherUserName
            );
          });

          return [...privateChats, ...groups];
        }),
        tap((chats) => {
          this.chatStorageService.setChats(chats);
        })
      );
  }

  getAllMessage() {
    // TODO: implement
  }

  sendMessage() {
    // TODO: implement
  }
}
