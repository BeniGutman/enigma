import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../api.service';
import { PrivateChat } from '../models/private-chat.model';

@Injectable({
  providedIn: 'root',
})
export class PrivateChatService {
  constructor(private apiService: ApiService) {}

  getAllPrivateChats(): Observable<PrivateChat[]> {
    return this.apiService.get('chats/privateChats').pipe(
      map((results: any) => {
        const privateChats = results.map((result: any) => {
          let otherUserName = result.firstUser.userName;
          if (otherUserName === 'myUserName') {
            otherUserName = result.secondUser.userName;
          }
          return new PrivateChat(result.chatId, result.messages, otherUserName);
        });
        return privateChats;
      })
    );
  }

  openPrivateChat() {
    // TODO: implement
  }
}
