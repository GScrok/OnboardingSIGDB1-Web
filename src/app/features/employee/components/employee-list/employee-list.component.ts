import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { DateUtils } from 'src/app/shared/date-utils';

import { Employee } from '../../models/employee.model';
import { EmployeeFilter } from '../../models/employee.filter.model';

import { EmployeeService } from '../../services/employee.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  protected routes = AppRoutes;

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

  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private dateUtils: DateUtils,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();

    this.buildCleanCompanyFilter();
  }

  private buildCleanCompanyFilter() {
    this.filterForm = this.fb.group({
      name: [''],
      cpf: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  private loadEmployees(): void {
    this.employeeService
      .getAll()
      .subscribe({
        next: (data) => (this.employees = data),
        error: () => this.errorHandlingService.handleGenericError(),
      });
  }

  public onFilter(): void {
    const payload: EmployeeFilter = this.createPayloadCompanyFilter();

    this.filterEmployees(payload);
  }

  private filterEmployees(payload: EmployeeFilter) {

    this.employeeService
      .getByFilters(payload)
      .subscribe({
        next: (data) => (this.employees = data),
        error: (err) => this.errorHandlingService.handleErrors(err),
      });
  }

  private createPayloadCompanyFilter(): EmployeeFilter {
    return {
      name: String(this.filterForm.value.name),
      cpf: this.filterForm.value.cpf,
      startDate: this.dateUtils.formatDateForFilter(
        this.filterForm.value.startDate,
      ),
      endDate: this.dateUtils.formatDateForFilter(
        this.filterForm.value.endDate,
      ),
    };
  }

  public clearFilter(): void {
    this.buildCleanCompanyFilter();
  }

  public async deleteEmployee(id: number): Promise<void> {
    const result = await this.notificationService.confirmation(
      'Deseja excluir este funcionário?',
      'Você não poderá reverter isso!',
    );

    if (result.isConfirmed) {
      this.executeDelete(id);
    }
  }

  private executeDelete(id: number) {
    this.employeeService
      .delete(id)
      .subscribe({
        next: () => {
          this.notificationService.success('Deletado com sucesso.');
          this.loadEmployees();
        },
        error: (err) => this.errorHandlingService.handleErrors(err),
      });
  }
}
