import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'formatRecentChats'
})
export class FormatRecentChatsPipe implements PipeTransform {

  transform(array: any[], thisUser: any, activeChatUser: any, ...args: any[]): any {
    return array.map((chatroom) => {
      let { user1, user2, lastMessage } = chatroom;
      let otherUser = user2._id == thisUser._id ? user1 : user2;

      let today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      let todayTime = today.getTime();

      let yesterday = new Date(today.getDate() - 1);
      yesterday.setHours(0);
      yesterday.setMinutes(0);
      yesterday.setSeconds(0);
      let yesterdayTime = yesterday.getTime();

      let format = "MMM d, y, h:mm a";
      let messageCreationTime = new Date(lastMessage.created).getTime();
      if (messageCreationTime >= todayTime) format = "\'Today, \'h:mm a";
      else if (messageCreationTime >= yesterdayTime) format = "\'Yesterday, \'h:mm a";
      
      return {
        user: otherUser,
        name: `${otherUser.firstName} ${otherUser.lastName}`,
        date: formatDate(lastMessage.created, format, "en-US"),
        timestamp: Number.isFinite(lastMessage.created) ? lastMessage.created : Date.parse(lastMessage.created),
        senderName: lastMessage.sender.firstName,
        messageContent: lastMessage.body,
        imageUrl: "https://ptetutorials.com/images/user-profile.png",
        active: (activeChatUser && activeChatUser._id == otherUser._id) ? 'active_chat' : ''
      };
    });
  }

}
