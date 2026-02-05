import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit {
  isLoading = false;

  roleForm: FormGroup;
  isEditMode = false;
  roleId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.roleForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;

      this.isEditMode = true;
      this.roleId = Number(id);

      this.roleService
        .getById(this.roleId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (data) => this.roleForm.patchValue(data),
          error: (err) => {
              this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
          },
        });
    }
  }

  onSave(): void {
    if (this.roleForm.invalid) return;

    const role: Role = this.roleForm.value;

    this.isLoading = true;

    if (this.isEditMode && this.roleId) {
      role.id = this.roleId;
      this.roleService
        .update(role)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => this.onSuccess(),
          error: (err) => {
            if (err.error && err.error.errors) {
              const errorList = err.error.errors;

              errorList.forEach((mensagem: string) => {
                this.toastr.error(mensagem, 'Erro');
              });
            } else {
              this.toastr.error('Ocorreu um erro inesperado.', 'Erro');

              this.router.navigate(['/role'])
            }
          },
        });
    } else {
      this.roleService
        .create(role)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
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
    }
  }

  onSuccess(): void {
    this.toastr.success('Salvo com sucesso');
    this.router.navigate(['/role']);
  }

  onCancel(): void {
    this.router.navigate(['/role']);
  }
}
