import { NotificationService } from './../notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  public handleErrors(err: HttpErrorResponse, route?: string) {
    const errors = err?.error?.errors;

    if (errors && errors.length > 0) {
      errors.forEach((mensagem: string) => {
        this.notificationService.error(mensagem);
      });

      if (route) this.router.navigate([`/${route}`]);
    } else {
      this.handleGenericError(route);
    }
  }

  public handleGenericError(route?: string) {
    this.notificationService.error('Ocorreu um erro inesperado.');
    if (route) this.router.navigate([`/${route}`]);
  }
}
