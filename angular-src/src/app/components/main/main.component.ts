import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  user: any;
  authenticated = false;
  authChangeSubscription: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.authenticated = this.auth.isAuthenticated();
    this.user = this.auth.getUser();
    this.authChangeSubscription = this.auth.authChange
      .subscribe(authenticated => {
        this.authenticated = authenticated;
      });
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.authChangeSubscription.unsubscribe();
  }

}
