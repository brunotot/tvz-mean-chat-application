import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './components/administration/administration.component';
import { ChatComponent } from './components/chat/chat.component';
import { MainComponent } from './components/main/main.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { AlreadyAuthenticatedGuard } from './guards/already.authenticated.guard';
import { AuthenticationGuard } from './guards/auth.guard';
import { AuthenticationAdminOnlyGuard } from './guards/auth.guard.admin.only';
import { AuthModule } from './modules/auth.module';

const routes: Routes = [
  {path:'', component:MainComponent, canActivate: [AuthenticationGuard]},
  {path:'login', loadChildren: () => AuthModule, canActivate: [AlreadyAuthenticatedGuard]},
  {path:'register', component:RegisterComponent, canActivate: [AlreadyAuthenticatedGuard]},
  {path:'chat', component:ChatComponent, canActivate: [AuthenticationGuard]},
  {path:'profile/:userId', component:ProfileComponent, canActivate: [AuthenticationGuard]},
  {path:'administration', component:AdministrationComponent, canActivate: [AuthenticationAdminOnlyGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
