import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  isLoading = false;

  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      cpf: ['', [Validators.required]],
      hiringDate: [null],
      companyId: [null],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;

      this.isEditMode = true;
      this.employeeId = Number(id);

      this.employeeService
        .getById(this.employeeId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (emp) => {
            this.employeeForm.patchValue(emp);
          },
          error: (err) => {
            this.toastr.error('Ocorreu um erro inesperado.', 'Erro');

            this.router.navigate(['/employee']);
          },
        });
    }
  }

  onSave(): void {
    if (this.employeeForm.invalid) return;

    const employee: Employee = this.employeeForm.value;

    this.isLoading = true;

    if (this.isEditMode && this.employeeId) {
      employee.id = this.employeeId;
      this.employeeService
        .update(employee)
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
    } else {
      this.employeeService
        .create(employee)
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
    this.router.navigate(['/employee']);
  }

  onCancel(): void {
    this.router.navigate(['/employee']);
  }
}
