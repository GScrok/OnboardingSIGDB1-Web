import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { EmployeeService } from './../../services/employee.service';
import { EmployeeRoleHistory } from '../../models/employee-role-history.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-role-history',
  templateUrl: './employee-role-history.component.html',
  styleUrls: ['./employee-role-history.component.scss'],
})
export class EmployeeRoleHistoryComponent implements OnInit {
  isLoading = false;

  employeeRoleHistory: EmployeeRoleHistory[] = [];

  employeeId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = Number(id);

      this.isLoading = true;

      this.employeeService
        .getRoleHistory(this.employeeId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (data) => (this.employeeRoleHistory = data),
          error: (err) => {
            if (err.error && err.error.errors) {
              const errorList = err.error.errors;

              errorList.forEach((mensagem: string) => {
                this.toastr.error(mensagem, 'Erro');
              });
            } else {
              this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
            }

            this.router.navigate(['/employee']);
          },
        });
    } else {
      this.toastr.error('Necessário informar o id na rota de pesquisa', 'Erro');

      this.router.navigate(['/employee']);
    }
  }
}
