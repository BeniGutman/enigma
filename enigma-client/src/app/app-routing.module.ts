import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ChatsComponent } from './chats/chats.component';
import { ChatComponent } from './chats/chat/chat.component';
import { AuthGuard } from './auth/auth.guard';
import { ChatListResolverService } from './chats/services/chat-list-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: '/chats', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: 'chats',
    component: ChatsComponent,
    canActivate: [AuthGuard],
    resolve: [ChatListResolverService],
    children: [
      // { path: '', component: RecipeStartComponent },
      // { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: ChatComponent,
        // resolve: [RecipesResolverService]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
