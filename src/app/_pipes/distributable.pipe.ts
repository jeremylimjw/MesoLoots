import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distributable'
})
export class DistributablePipe implements PipeTransform {

  transform(value: number, ...args: number[]): number {
    if (!args || !args[0]) return value;
    
    return Math.trunc((value/args[0])*0.95);
  }

}
