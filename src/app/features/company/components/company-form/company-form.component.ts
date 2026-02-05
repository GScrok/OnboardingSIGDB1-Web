import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

import { DateUtils } from 'src/app/shared/date-utils';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
})
export class CompanyFormComponent implements OnInit {
  isLoading = false;

  companyForm: FormGroup;
  isEditMode: boolean = false;
  companyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private dateUtils: DateUtils,
    private toastr: ToastrService,
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      cnpj: ['', [Validators.required]],
      foundationDate: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.companyId = Number(id);
      this.loadCompany(this.companyId);
    }
  }

  loadCompany(id: number): void {
    this.isLoading = true;

    this.companyService
      .getById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (company) => {
          this.companyForm.patchValue(company);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Ocorreu um erro inesperado.', 'Erro');
          this.router.navigate(['/company'])
        },
      });
  }

  onSave(): void {
    if (this.companyForm.invalid) {
      return;
    }

    const company: Company = {
      id: this.companyId,
      name: this.companyForm.value.name,
      cnpj: this.companyForm.value.cnpj,
      FoundationDate: this.dateUtils.formatDate(
        this.companyForm.value.foundationDate,
      ),
    };

    this.isLoading = true;

    if (this.isEditMode && this.companyId) {
      company.id = this.companyId;

      this.companyService
        .update(company)
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
      this.companyService
        .create(company)
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
    this.router.navigate(['/company']);
  }

  onCancel(): void {
    this.router.navigate(['/company']);
  }
}
