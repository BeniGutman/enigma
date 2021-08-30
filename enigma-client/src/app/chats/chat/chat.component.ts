import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ChatStorageService } from '../services/chat-storage.service';
import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  chat: Chat | undefined;
  id: number | undefined;
  messages: Message[] | undefined;

  constructor(
    private chatStorageService: ChatStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.chat = this.chatStorageService.getChat(this.id);
      if (!this.chat) {
        this.router.navigate(['..'], { relativeTo: this.route });
      }
      this.messages = this.chat!.messages;
    });
  }
}
