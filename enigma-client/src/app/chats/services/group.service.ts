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

  openGroup() {
    // TODO: implement
  }

  addMember() {
    // TODO: implement
  }

  removeMember() {
    // TODO: implement
  }

  leaveGroup() {
    // TODO: implement
  }

  getMembers() {
    // TODO: implement
  }
}
