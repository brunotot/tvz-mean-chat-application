import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthService {

  private user: any;
  private token: string;
  errorEmitter: Subject<string> = new Subject<string>();
  authChange: Subject<boolean> = new Subject<boolean>();

  constructor(private userService: UserService, private router: Router) { }

  login(credentials: {username: string, password: string}) {
    let loginBody = {
      username: credentials.username,
      password: credentials.password
    }
    this.userService.login(loginBody).subscribe(
      (res: any) => {
        this.user = res.user;
        this.token = res.token;
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);
        this.authChange.next(true);
        this.router.navigate(['/']);
      },
      (errorResponse) => this.errorEmitter.next(errorResponse)
    );
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.token = localStorage.getItem('token');
    }
    return {...this.user};
  }

  isAuthenticated() {
    return this.user != null;
  }

  getToken() {
    return localStorage.getItem('token');
  }
  
}
