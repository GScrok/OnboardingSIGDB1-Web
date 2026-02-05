import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { EmployeeFilter } from '../../models/employee.filter.model';
import { DateUtils } from 'src/app/shared/date-utils';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  isLoading = false;

  employees: Employee[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'cpf',
    'hiringDate',
    'company',
    'role',
    'actions',
  ];

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private dateUtils: DateUtils,
    private toastr: ToastrService,
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      cpf: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;

    this.employeeService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => (this.employees = data),
        error: (err) => {
          console.log(err);
          this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
        },
      });
  }

  onFilter(): void {
    const payload: EmployeeFilter = {
      name: String(this.filterForm.value.name),
      cpf: this.filterForm.value.cpf,
      startDate: this.dateUtils.formatDateForFilter(
        this.filterForm.value.startDate,
      ),
      endDate: this.dateUtils.formatDateForFilter(
        this.filterForm.value.endDate,
      ),
    };

    this.isLoading = true;

    this.employeeService
      .getByFilters(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => (this.employees = data),
        error: (err) => {
          if (err.error && err.error.errors) {
            const errorList = err.error.errors;

            errorList.forEach((mensagem: string) => {
              this.toastr.error(mensagem, 'Erro');
            });
          } else {
            this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
          }
        },
      });
  }

  clearFilter(): void {
    this.filterForm = this.fb.group({
      name: [''],
      cnpj: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  deleteEmployee(id: number): void {
    Swal.fire({
      title: 'Deseja excluir este funcionário?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.employeeService
          .delete(id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: () => {
              this.toastr.success('Deletado com sucesso.', 'Sucesso!');
              this.loadEmployees();
            },
            error: (err) => {
              if (err.error && err.error.errors) {
                const errorList = err.error.errors;

                errorList.forEach((mensagem: string) => {
                  this.toastr.error(mensagem, 'Erro');
                });
              } else {
                this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
              }
            },
          });
      }
    });
  }
}
