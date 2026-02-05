import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit {
  isLoading = false;

  roles: Role[] = [];
  displayedColumns: string[] = ['id', 'description', 'actions'];

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private toastr: ToastrService,
  ) {
    this.filterForm = this.fb.group({
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;

    this.roleService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => (this.roles = data),
        error: (err) => {
          this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
        },
      });
  }

  onFilter(): void {
    this.isLoading = true;

    this.roleService
      .getByFilters(this.filterForm.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => (this.roles = data),
        error: (err) => {
          this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
        },
      });
  }

  clearFilter() {
    this.filterForm = this.fb.group({
      description: [''],
    });
  }

  deleteRole(id: number): void {
    Swal.fire({
      title: 'Deseja excluir este cargo?',
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
        this.roleService
          .delete(id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: () => {
              this.toastr.success('Deletado com sucesso.', 'Sucesso!');
              this.loadRoles();
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
