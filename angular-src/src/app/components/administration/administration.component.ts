import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChatroomService } from 'src/app/services/chatroom-service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  errorMessage: string;
  users: any = [];
  thisUser: any;
  creatingNew: false;
  username: string = '';
  role: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(public location: Location, private route: ActivatedRoute, private router: Router, private userService: UserService, private auth: AuthService, private chatroomService: ChatroomService) { }

  ngOnInit(): void {
    this.thisUser = this.auth.getUser();
    const http$ = this.userService.findAll();
    http$.subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }

  applyNewUser() {
    let newUser = {
      username: this.username,
      password: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role
    }
    const http$ = this.userService.create(newUser);
    http$.subscribe(
      (res: any) => {
        this.users.push(res);
        this.users = this.users.slice();
        this.username = '';
        this.lastName = '';
        this.firstName = '';
        this.role = '';
        this.creatingNew = false;
      },
      (err) => {
        alert(err.error.message);
      }
    );
  }

  delete(userId) {
    const http$ = this.userService.delete(userId);
    http$.subscribe(
      (res) => {
        let index = this.users.findIndex((u) => u._id == userId);
        this.users.splice(index, 1);
        this.users = this.users.slice();
      },
      (err) => {
        alert(err.error.message);
      }
    );
  }

  applyUser(user) {
    const http$ = this.userService.update(user);
    http$.subscribe(
      (res: any) => {
        let index = this.users.findIndex((u) => user._id == u._id);
        res._id = user._id;
        this.users[index] = res;
        this.users = this.users.slice();
      },
      (err) => {
        alert(err.error.message);
      }
    );
  }

  dropDatabase() {
    this.chatroomService.dropDatabases()
    .subscribe(
      (res) => {},
      (error) => alert(error.error.message)
    )
  }

}
