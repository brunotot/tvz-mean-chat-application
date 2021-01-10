import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatUsersWithoutAdmin'
})
export class FormatUsersWithoutAdminPipe implements PipeTransform {

  transform(array: any[], thisUser: any, ...args: any[]): any {
    return array.filter((u) => u._id != thisUser._id).map((u) => {
      let { _id, username, firstName, lastName, role } = u;
      return {
        _id: u._id,
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        isUpdating: false,
        updatedUser: {
          _id: _id,
          username: username,
          firstName: firstName,
          lastName: lastName,
          role: role,
        }
      };
    });
  }

}
