import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateUtils {

  constructor(private datePipe: DatePipe) {}

  formatDate(date: Date | string | null | undefined): string | null {
    if (!date) return null;
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  formatDateForFilter(date: Date | string | null | undefined): string | null {
    if (!date) return '';
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}
