import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { EmployeeRole } from './../../models/employee-role.model';
import { Employee } from '../../models/employee.model';
import { Role } from 'src/app/features/role/models/role.model';
import { RoleService } from 'src/app/features/role/services/role.service';
import { EmployeeService } from '../../services/employee.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';

@Component({
  selector: 'app-link-role',
  templateUrl: './link-role.component.html',
  styleUrls: ['./link-role.component.scss'],
})
export class LinkRoleComponent implements OnInit {
  protected routes = AppRoutes;

  roles: Role[] = [];
  employee: Employee | null = null;

  roleFilter!: FormGroup;
  employeeRoleForm!: FormGroup;

  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  ngOnInit(): void {
    this.buildCleanRoleFilter();
    this.buildCleanEmployeeForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = Number(id);

      this.getEmployeeById();

      this.filterRole();
    } else {
      this.onError();
    }
  }

  private filterRole() {
    this.roleService.getByFilters(this.roleFilter.value).subscribe({
      next: (data) => (this.roles = data),
      error: () => {
        this.notificationService.error('Ocorreu um erro inesperado.');
      },
    });
  }

  private getEmployeeById() {
    this.employeeService.getById(this.employeeId!).subscribe({
      next: (data) => (this.employee = data),
      error: () => this.errorHandlingService.handleGenericError(this.routes.PATHS.EMPLOYEE.ROOT),
    });
  }

  private onError() {
    this.notificationService.error(
      'Necessário informar o id na rota de pesquisa',
    );

    this.router.navigate(this.routes.LINKS.EMPLOYEE.LIST);
  }

  private buildCleanEmployeeForm() {
    this.employeeRoleForm = this.fb.group({
      roleId: [null, [Validators.required, Validators.nullValidator]],
      startDate: [null, [Validators.required]],
    });
  }

  private buildCleanRoleFilter() {
    this.roleFilter = this.fb.group({
      description: [''],
    });
  }

  public onSave(): void {
    if (!this.isFormValid()) {
      return;
    }

    const employeeRole: EmployeeRole = this.employeeRoleForm.value;

    this.linkRole(employeeRole);
  }

  private isFormValid(): boolean {
    if (this.employeeRoleForm.invalid) {
      this.employeeRoleForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  private linkRole(employeeRole: EmployeeRole) {
    this.employeeService.linkRole(this.employeeId!, employeeRole).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.errorHandlingService.handleErrors(err),
    });
  }

  private onSuccess(): void {
    this.notificationService.success('Vinculado com sucesso');
    this.router.navigate(this.routes.LINKS.EMPLOYEE.LIST);
  }

  public onCancel(): void {
    this.router.navigate(this.routes.LINKS.EMPLOYEE.LIST);
  }
}
