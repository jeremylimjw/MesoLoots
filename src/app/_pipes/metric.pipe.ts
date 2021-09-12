import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metric'
})
export class MetricPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): number {
    if (value && typeof value === 'string') {
      let lastChar = value.substr(-1, 1);

      if (lastChar.toLocaleLowerCase() === 'b') {
        let str =  value.slice(0, -1);
        return parseFloat(str)*1e9;
      } else if (lastChar.toLowerCase() === 'm') {
        let str =  value.slice(0, -1);
        return parseFloat(str)*1e6;
      } else if (lastChar.toLowerCase() === 'k') {
        let str =  value.slice(0, -1);
        return parseFloat(str)*1e3;
      } else {
        return parseFloat(value);
      }

    } 

    return parseFloat(value);
  }

}
