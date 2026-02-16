import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private toastr: ToastrService
  ) {}

  success(message: string): void {
    this.toastr.success(message);
  }

  error(message: string): void {
    this.toastr.error(message);
  }

  confirmation(title:string, text:string){
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    })
  }
}
