import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatroomService } from 'src/app/services/chatroom-service';
import { MessageService } from 'src/app/services/message-service';
import { SocketService } from 'src/app/services/socket-service';
import { ModalService } from './../../services/modal-service';
import { NewMessageModalComponent } from './../../modals/new-message-modal/new-message-modal.component';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit {

  @ViewChildren("messages") messageContainers: QueryList<ElementRef>;
  @ViewChild('newMessageModal') newMessageModal: NewMessageModalComponent;
  @ViewChild('scrollMe') private scrollContainer: ElementRef;
  @ViewChild('file') fileVariable: ElementRef;
  activeChatUser: any = null;
  chatrooms = [];
  activeMessages: any = [];
  activeChatroomIndex: number = -1;
  thisUser = null;
  messageBody = '';
  scrollDown = false;
  search: string = '';
  selectedFiles: File[] = [];
  disableScrollDown = false

  constructor(public location: Location, public modalService: ModalService, private socketService: SocketService, private auth: AuthService, private chatroomService: ChatroomService, private messageService: MessageService, private sanitizer: DomSanitizer) {
    this.thisUser = this.auth.getUser();
    this.socketService.listen(`message-receive/${this.thisUser._id}`).subscribe((message: any) => {
      let chatroomIndex = this.chatrooms.findIndex((chatroom) => chatroom._id == message.chatroom._id);
      if (this.activeChatroomIndex == chatroomIndex && (chatroomIndex != -1 || (this.thisUser._id == message.sender._id))) {
        this.activeMessages.push(message);
        this.activeMessages = this.activeMessages.slice();
      }
      if (chatroomIndex == -1) {
        this.chatrooms.push(message.chatroom);
        chatroomIndex = this.chatrooms.length - 1;
      } else {
        this.chatrooms[chatroomIndex].messageIds.push(message._id);
      }
      this.chatrooms[chatroomIndex].lastMessage = message;
      this.activeChatroomIndex = chatroomIndex;
      this.chatrooms = this.chatrooms.slice();
    });
  }

  ngOnInit(): void {
    this.chatroomService.findAllFromMe().subscribe(
      async (chatrooms: any) => {
        for (let i = 0; i < chatrooms.length; i++) {
          let lastMessageId = chatrooms[i].messageIds.length - 1;
          if (lastMessageId >= 0) {
            chatrooms[i].lastMessage = await this.messageService.getMessage(chatrooms[i].messageIds[lastMessageId]);
          }
        }
        this.chatrooms = chatrooms;
      },
      (error) => alert(error.error.message)
    );
  }

  ngAfterViewInit() {
    this.messageContainers.changes.subscribe((list: QueryList<ElementRef>) => {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    });
  }

  makeActive(chatroom) {
    if (!this.activeChatUser || this.activeChatUser._id != chatroom.user._id) {
      this.openChat(chatroom.user);
      this.search = '';
    }
  }

  async openChat(user) {
    if (!this.activeChatUser || this.activeChatUser._id != user._id) {
      this.activeChatUser = user;
      this.activeChatroomIndex = this.chatrooms.findIndex((c) => c.user1._id == user._id || c.user2._id == user._id);
      this.messageBody = '';
      if (this.activeChatroomIndex == -1) {
        this.activeMessages = [];
      } else {
        let activeMessageIds = this.chatrooms[this.activeChatroomIndex].messageIds.slice();
        this.activeMessages = await this.messageService.getMessages(activeMessageIds);
      }
    }
  }

  sendMessage() {
    this.messageService.sendMessage(this.activeChatUser._id, this.messageBody, this.selectedFiles).subscribe(
      (res) => {
        this.messageBody = '';
        this.selectedFiles = [];
        this.socketService.emit('message send', {
          result: res,
          senderId: this.thisUser._id,
          receiverId: this.activeChatUser._id
        });
      },
      (error) => alert(error.error.message)
    );
  }

  shareCurrentLocation() {
    navigator.geolocation.getCurrentPosition(res => {
      let { latitude, longitude } = res.coords;
      this.messageService.sendLocation(this.activeChatUser._id, latitude, longitude).subscribe(
        (res: any) => {
          this.socketService.emit('message send', {
            result: res,
            senderId: this.thisUser._id,
            receiverId: this.activeChatUser._id
          });
        },
        (error) => alert(error.error.message)
      );
    });
  }

  filesAdded(event) {
    if (event.target.files.length) {
      this.selectedFiles = [];
      for (let i = 0; i < event.target.files.length; i++){ 
        this.selectedFiles.push(event.target.files[i]);
      }
    }
  }

  trackById(index, item) {
    return item.id;
  }

}
