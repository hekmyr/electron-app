import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {
  transform(value: Date): string {
    if (!value) {
      return '';
    }

    const today = new Date();
    let age = today.getFullYear() - value.getFullYear();
    const monthDiff = today.getMonth() - value.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < value.getDate())) {
      age--;
    }

    return age.toString();
  }
}
