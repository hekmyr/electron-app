import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date, format: string = 'dd/MM/yyyy HH:mm') {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, format);
  }
}
