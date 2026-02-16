import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { Company } from './../../../company/models/company.model';
import { CompanyService } from 'src/app/features/company/services/company.service';
import { Employee } from './../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';

@Component({
  selector: 'app-link-company',
  templateUrl: './link-company.component.html',
  styleUrls: ['./link-company.component.scss'],
})
export class LinkCompanyComponent implements OnInit {
  protected routes = AppRoutes;

  companies: Company[] = [];
  employee: Employee | null = null;

  companyFilter!: FormGroup;
  employeeForm!: FormGroup;

  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandlingService: ErrorHandlingService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.buildCleanCompanyFilter();
    this.buildCleanEmployeeForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = Number(id);

      this.getEmployeeById();

      this.filterCompany();
    } else {
      this.onError();
    }
  }

  private onError() {
    this.notificationService.error(
      'Necessário informar o id na rota de pesquisa',
    );

    this.router.navigate(this.routes.LINKS.EMPLOYEE.LIST);
  }

  private filterCompany() {
    this.companyService
      .getByFilters(this.companyFilter.value)
      .subscribe({
        next: (data) => (this.companies = data),
        error: () => this.errorHandlingService.handleGenericError(),
      });
  }

  private getEmployeeById() {
    this.employeeService
      .getById(this.employeeId!)
      .subscribe({
        next: (data) => (this.employee = data),
        error: () => this.errorHandlingService.handleGenericError(this.routes.PATHS.EMPLOYEE.ROOT),
      });
  }

  private buildCleanEmployeeForm() {
    this.employeeForm = this.fb.group({
      companyId: ['', [Validators.required, Validators.nullValidator]],
    });
  }

  private buildCleanCompanyFilter() {
    this.companyFilter = this.fb.group({
      name: [''],
      cnpj: [''],
    });
  }

  public onSave(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.employee!.companyId = this.employeeForm.value.companyId;

    this.linkCompany();
  }

  private linkCompany() {
    this.employeeService
      .update(this.employee!)
      .subscribe({
        next: () => this.onSuccess(),
        error: (err) => this.errorHandlingService.handleErrors(err),
      });
  }

  private isFormValid(): boolean {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  private onSuccess(): void {
    this.notificationService.success('Vinculado com sucesso');
    this.router.navigate(this.routes.LINKS.EMPLOYEE.LIST);
  }

  public onCancel(): void {
    this.router.navigate(this.routes.LINKS.EMPLOYEE.LIST);
  }
}
