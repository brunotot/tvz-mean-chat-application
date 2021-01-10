import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'formatActiveMessages'
})
export class FormatActiveMessagesPipe implements PipeTransform {

  transform(array: any[], thisUser: any, ...args: any[]): any {
    return array.map((message) => {
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
      let messageCreationTime = new Date(message.created).getTime();
      if (messageCreationTime >= todayTime) {
        format = "\'Today, \'h:mm a";
      } else if (messageCreationTime >= yesterdayTime) {
        format = "\'Yesterday, \'h:mm a";
      }
      
      return {
        senderClass: thisUser._id == message.sender._id ? 'outgoing_msg' : 'incoming_msg',
        body: message.body,
        created: formatDate(message.created, format, "en-US"),
        attachments: message.attachments
      };
    });
  }

}
