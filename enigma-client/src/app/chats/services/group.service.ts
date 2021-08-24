import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private apiService: ApiService) {}

  getAllGroups(): Observable<Group[]> {
    return this.apiService.get('chats/groups').pipe(
      map((results: any) => {
        const groups = results.map((result: any) => {
          return new Group(
            result.chatId,
            result.name,
            result.members,
            result.messages
          );
        });
        return groups;
      })
    );
  }

  openGroup(groupName: string) {
    return this.apiService.post('chats/groups/', { groupName });
  }

  getMembers(chatId: number) {
    return this.apiService.get(`chats/groups/${chatId}/members`);
  }

  leaveGroup(chatId: number) {
    return this.apiService.delete(`chats/groups/${chatId}/members/me`);
  }

  addMember(chatId: number, otherUserName: string) {
    return this.apiService.post(
      `chats/groups/${chatId}/members/${otherUserName}`
    );
  }

  removeMember(chatId: number, otherUserName: string) {
    return this.apiService.delete(
      `chats/groups/${chatId}/members/${otherUserName}`
    );
  }
}
