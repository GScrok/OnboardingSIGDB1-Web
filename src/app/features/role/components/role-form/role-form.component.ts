import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit {
  protected routes = AppRoutes;

  roleForm!: FormGroup;
  isEditMode = false;
  roleId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  ngOnInit(): void {
    this.buildCleanRoleForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.setEditMode(id);

      this.getRoleById(this.roleId!);
    }
  }

  private getRoleById(roleId: number) {
    this.roleService
      .getById(roleId)
      .subscribe({
        next: (data) => this.roleForm.patchValue(data),
        error: () => {
          this.notificationService.error('Ocorreu um erro inesperado.');
        },
      });
  }

  private setEditMode(id: string) {
    this.isEditMode = true;
    this.roleId = Number(id);
  }

  private buildCleanRoleForm() {
    this.roleForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  public onSave(): void {
    if (!this.isFormValid()) {
      return;
    }

    const role: Role = this.roleForm.value;

    this.executeSave(role);
  }

  private isFormValid(): boolean {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  private executeSave(role: Role) {
    this.roleService
      .save(role)
      .subscribe({
        next: () => this.onSuccess(),
        error: (err) => this.errorHandlingService.handleErrors(err),
      });
  }

  private onSuccess(): void {
    this.notificationService.success('Salvo com sucesso');
    this.router.navigate(this.routes.LINKS.ROLE.LIST);
  }

  public onCancel(): void {
    this.router.navigate(this.routes.LINKS.ROLE.LIST);
  }
}
