import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private static readonly _locale = 'en-US';

  public static formatLongDate(date: Date): string {
    const weekday = new Intl.DateTimeFormat(UtilService._locale, { weekday: 'long' }).format(date);
    const day = new Intl.DateTimeFormat(UtilService._locale, { day: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat(UtilService._locale, { month: 'long' }).format(date);
    const year = new Intl.DateTimeFormat(UtilService._locale, { year: 'numeric' }).format(date);

    let daySuffix = 'th';
    if (day.endsWith('1') && !day.endsWith('11')) {
      daySuffix = 'st';
    } else if (day.endsWith('2') && !day.endsWith('12')) {
      daySuffix = 'nd';
    } else if (day.endsWith('3') && !day.endsWith('13')) {
      daySuffix = 'rd';
    }

    return `${weekday} ${day}${daySuffix}, ${month} ${year}`;
  }
}
