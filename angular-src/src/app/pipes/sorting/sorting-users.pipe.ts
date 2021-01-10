import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortingUsers'
})
export class SortingUsersPipe implements PipeTransform {

  transform(array: any[], search: string, ...args: any[]): any {
    if (search) {
      array = array.filter((user) => {
        let name = user.firstName + " " + user.lastName;
        name = name.toLowerCase();
        return name.includes(search.toLowerCase());
      });
    }
    return array.sort((a, b) => {
      let nameA = a.firstName + " " + a.lastName;
      let nameB = b.firstName + " " + b.lastName;
      return nameA.localeCompare(nameB);
    });
  }

}
