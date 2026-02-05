import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { EmployeeRole } from './../../models/employee-role.model';
import { EmployeeService } from '../../services/employee.service';
import { RoleService } from 'src/app/features/role/services/role.service';
import { Role } from 'src/app/features/role/models/role.model';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-link-role',
  templateUrl: './link-role.component.html',
  styleUrls: ['./link-role.component.scss'],
})
export class LinkRoleComponent implements OnInit {
  roles: Role[] = [];

  roleFilter: FormGroup;
  employeeRoleForm: FormGroup;

  employeeId: number | null = null;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.roleFilter = fb.group({
      description: [''],
    });
    this.employeeRoleForm = fb.group({
      roleId: [null, [Validators.required, Validators.nullValidator]],
      startDate: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.employeeId = Number(id);

    this.roleService.getByFilters(this.roleFilter.value).subscribe({
      next: (data) => (this.roles = data),
      error: (err) => {
        this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
      },
    });
  }

  onSave(): void {
    if (this.employeeRoleForm.invalid) return;

    this.isLoading = true;

    try {
      const employeeRole: EmployeeRole = this.employeeRoleForm.value;
      this.employeeService.linkRole(this.employeeId!, employeeRole).subscribe({
        next: () => this.onSuccess(),
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
    } finally {
      this.isLoading = false;
    }
  }

  onSuccess(): void {
    this.toastr.success('Vinculado com sucesso');
    this.router.navigate(['/employee']);
  }

  onCancel(): void {
    this.router.navigate(['/employee']);
  }
}
