import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthenticationGuard } from './guards/auth.guard';
import { AlreadyAuthenticatedGuard } from './guards/already.authenticated.guard';
import { UserService } from './services/user.service';
import { AdministrationComponent } from './components/administration/administration.component';
import { ChatComponent } from './components/chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from './services/modal-service';
import { NewMessageModalComponent } from './modals/new-message-modal/new-message-modal.component';
import { CommonModule } from '@angular/common';
import { SortingRecentChatsPipe } from './pipes/sorting/sorting-recent-chats.pipe';
import { FormatRecentChatsPipe } from './pipes/format/format-recent-chats.pipe';
import { FormatActiveMessagesPipe } from './pipes/format/format-active-messages.pipe';
import { SortingUsersPipe } from './pipes/sorting/sorting-users.pipe';
import { ProfileComponent } from './components/profile/profile.component';
import { FormatUsersWithoutAdminPipe } from './pipes/format/format-users-without-admin.pipe';
import { MDBSpinningPreloader, MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { AgmCoreModule } from '@agm/core';
import { AuthenticationAdminOnlyGuard } from './guards/auth.guard.admin.only';
import { OpenImageModalComponent } from './modals/open-image-modal/open-image-modal.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { SecurePipe } from './pipes/secure/secure.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AdministrationComponent,
    ChatComponent,
    NewMessageModalComponent,
    SortingRecentChatsPipe,
    FormatRecentChatsPipe,
    FormatActiveMessagesPipe,
    SortingUsersPipe,
    ProfileComponent,
    FormatUsersWithoutAdminPipe,
    OpenImageModalComponent,
    SecurePipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    NgbModule,
    AgmCoreModule.forRoot({apiKey: "AIzaSyAz0SzutrNOu_jvmWjh5KfVfaJ2RmBd84M"}),
    MDBBootstrapModulesPro.forRoot()
  ],
  providers: [AuthService, AuthenticationGuard, AuthenticationAdminOnlyGuard, AlreadyAuthenticatedGuard, UserService, ModalService, MDBSpinningPreloader,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
