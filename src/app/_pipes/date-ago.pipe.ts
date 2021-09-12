import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: Date, args?: any): any {
    if (value) {
      value = new Date(value);
      const today = new Date();
      const yesterday = new Date(today.getTime() - 1000*60*60*24);

      if (today.toDateString() === value.toDateString()) return "Today";
      if (yesterday.toDateString() === value.toDateString()) return "Yesterday";

      if (args) {
        let seconds = Math.floor(((today.getTime() - value.getTime())/1000));
    
        let interval = seconds / 31536000;
      
        if (interval >= 1) {
          return new DatePipe('en-SG').transform(value, "d/M/YY EEEE");
        }
        return new DatePipe('en-SG').transform(value, "d/M EEEE");

      } else {
        let seconds = Math.floor(((today.getTime() - value.getTime())/1000));
    
        let interval = seconds / 31536000;
      
        if (interval >= 1) {
          return Math.floor(interval) + " year(s) ago";
        }
  
        interval = seconds / 2592000;
        if (interval >= 1) {
          return Math.floor(interval) + " month(s) ago";
        }
  
        interval = seconds / 86400;
        if (interval >= 1) {
          return Math.floor(interval) + " days ago";
        }
      }
    }

    return value;
  }

}
