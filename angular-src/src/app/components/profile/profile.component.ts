import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userId = '';
  user: any;
  errorMessage: string;
  thisUser: any;
  isUpdating: boolean = false;
  firstName: any;
  lastName: any;
  username: any;
  role: any;

  constructor(public location: Location, private route: ActivatedRoute, private router: Router, private userService: UserService, private auth: AuthService) { }

  ngOnInit(): void {
    this.thisUser = this.auth.getUser();
    this.userId = this.route.snapshot.params['userId'];
    const http$ = this.userService.findById(this.userId);
    http$.subscribe(
      (user: any) => {
        this.user = user;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = user.role;
        this.username = user.username;
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }

  applyUser() {
    let user = {
      _id: this.user._id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role
    }
    this.userService.update(user).subscribe(
      (res: any) => {
        this.user = {
          _id: this.thisUser._id,
          username: res.username,
          firstName: res.firstName,
          lastName: res.lastName,
          role: res.role 
        }
        this.updateOrCancel(res);
      },
      (err) => alert(err.error.message)
    );
  }

  updateOrCancel(user) {
    this.isUpdating = !this.isUpdating;
    if (this.isUpdating) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.username = user.username;
      this.role = user.role;
    }
  }

}
