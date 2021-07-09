import { Component, OnInit, Input } from '@angular/core';

import { Chat } from '../../models/chat.model';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.css'],
})
export class ChatItemComponent implements OnInit {
  @Input() chat: Chat | undefined;
  constructor() {}

  ngOnInit(): void {}
}
