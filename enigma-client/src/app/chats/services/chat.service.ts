import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { map, tap } from 'rxjs/operators';

import { ApiService } from '../../api.service';
import { Chat } from '../models/chat.model';
import { ChatStorageService } from './chat-storage.service';
import { GroupService } from './group.service';
import { PrivateChatService } from './private-chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private apiService: ApiService,
    private groupService: GroupService,
    private privateChatService: PrivateChatService,
    private chatStorageService: ChatStorageService
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

  getAllMessage() {
    // TODO: implement
  }

  sendMessage() {
    // TODO: implement
  }
}
