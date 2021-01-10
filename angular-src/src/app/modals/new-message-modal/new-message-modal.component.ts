import { EventEmitter, Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-message-modal',
  templateUrl: './new-message-modal.component.html',
  styleUrls: ['./new-message-modal.component.css']
})
export class NewMessageModalComponent implements OnInit {

  search: string = '';

  @ViewChild('content') content: ElementRef;
  users: any = [];
  thisUser: any;
  ref: any;

  constructor(private auth: AuthService, private userService: UserService) { }

  @Output() open = new EventEmitter<string>();

  ngOnInit(): void {
    this.thisUser = this.auth.getUser();
    const http$ = this.userService.findAll();
    http$.subscribe(
    (res: any) => {
      this.users = res.filter((u) => u._id != this.thisUser._id);
    }),
    (err) => {
      console.log(err);
    }

  }

  openUserChat(user) {
    this.search = '';
    this.open.next(user);
    this.ref.close();
  }

}
