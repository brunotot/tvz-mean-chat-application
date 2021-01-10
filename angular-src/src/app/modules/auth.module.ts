import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    RouterModule
  ]
})
export class AuthModule { }
