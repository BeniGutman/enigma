import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ChatStorageService } from '../services/chat-storage.service';
import { Chat } from '../models/chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  chats: Chat[] = [];
  subscription: Subscription | undefined;

  constructor(private chatStorageService: ChatStorageService) {}

  ngOnInit(): void {
    this.subscription = this.chatStorageService.chatAdded.subscribe(
      (chat: Chat) => {
        this.chats.push(chat);
      }
    );

    this.chats.push(...this.chatStorageService.getChats());
  }

  ngOnDestroy(): void {
    this.subscription!.unsubscribe();
  }
}
