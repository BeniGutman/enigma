import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Chat } from '../models/chat.model';
import { ChatService } from './chat.service';
import { ChatStorageService } from './chat-storage.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChatListResolverService implements Resolve<Chat[]> {
  constructor(
    private chatService: ChatService,
    private chatStorageService: ChatStorageService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const chats = this.chatStorageService.getChats();

    if (chats.length === 0) {
      return this.chatService.getAllChats().pipe(
        tap((chats: Chat[]) => {
          this.chatStorageService.setChats(chats);
        })
      );
    } else {
      return chats;
    }
  }
}
