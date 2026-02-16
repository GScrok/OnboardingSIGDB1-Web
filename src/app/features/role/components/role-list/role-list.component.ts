import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit {
  protected routes = AppRoutes;

  roles: Role[] = [];
  displayedColumns: string[] = ['id', 'description', 'actions'];

  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  ngOnInit(): void {
    this.loadRoles();

    this.buildCleanRoleFilter();
  }

  private buildCleanRoleFilter() {
    this.filterForm = this.fb.group({
      description: [''],
    });
  }

  private loadRoles(): void {
    this.roleService
      .getAll()
      .subscribe({
        next: (data) => (this.roles = data),
        error: () => this.errorHandlingService.handleGenericError(),
      });
  }

  public onFilter(): void {
    this.roleService
      .getByFilters(this.filterForm.value)
      .subscribe({
        next: (data) => (this.roles = data),
        error: () => this.errorHandlingService.handleGenericError(),
      });
  }

  public clearFilter() {
    this.buildCleanRoleFilter();
  }

  public async deleteRole(id: number): Promise<void> {
    const result = await this.notificationService.confirmation(
      'Deseja excluir este cargo?',
      'Você não poderá reverter isso!',
    );

    if (result.isConfirmed) {
      this.executeDelete(id);
    }
  }

  private executeDelete(id: number) {
    this.roleService
      .delete(id)
      .subscribe({
        next: () => {
          this.notificationService.success('Deletado com sucesso.');
          this.loadRoles();
        },
        error: (err) => this.errorHandlingService.handleErrors(err),
      });
  }
}
