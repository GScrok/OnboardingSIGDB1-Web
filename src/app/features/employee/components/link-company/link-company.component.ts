import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { Company } from './../../../company/models/company.model';
import { CompanyService } from 'src/app/features/company/services/company.service';
import { Employee } from './../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-link-company',
  templateUrl: './link-company.component.html',
  styleUrls: ['./link-company.component.scss'],
})
export class LinkCompanyComponent implements OnInit {
  isLoading = false;

  companies: Company[] = [];
  employee: Employee | null = null;

  companyFilter: FormGroup;
  employeeForm: FormGroup;

  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.companyFilter = fb.group({
      name: [''],
      cnpj: [''],
    });
    this.employeeForm = fb.group({
      companyId: ['', [Validators.required, Validators.nullValidator]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.employeeId = Number(id);

    this.isLoading = true;

    this.employeeService
      .getById(this.employeeId!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => (this.employee = data),
        error: (err) => {
          this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
        },
      });

    this.companyService
      .getByFilters(this.companyFilter.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => (this.companies = data),
        error: (err) => {
          this.toastr.error('Ocorreu um erro inesperado.', 'Erro');

          this.router.navigate(['/employee']);
        },
      });
  }

  onSave(): void {
    if (this.employeeForm.invalid) return;

    this.employee!.companyId = this.employeeForm.value.companyId;

    this.isLoading = true;

    this.employeeService
      .update(this.employee!)
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

  onSuccess(): void {
    this.toastr.success('Vinculado com sucesso');
    this.router.navigate(['/employee']);
  }

  onCancel(): void {
    this.router.navigate(['/employee']);
  }
}
