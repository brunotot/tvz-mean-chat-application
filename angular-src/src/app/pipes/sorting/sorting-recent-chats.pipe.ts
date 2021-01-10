import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortingRecentChats'
})
export class SortingRecentChatsPipe implements PipeTransform {

  transform(array: any[], search: string, ...args: any[]): any {
    if (search && search.length > 0) {
      array = array.filter((recent) => recent.name.toLowerCase().includes(search.toLowerCase()));
    }
    return array.sort((a, b) => {
      return a.timestamp > b.timestamp ? -1 : 1;
    });
  }

}
