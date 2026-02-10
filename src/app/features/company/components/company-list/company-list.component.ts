import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { finalize } from 'rxjs/operators';

import { Company } from '../../models/company.model';
import { CompanyFilter } from './../../models/company.filter.model';

import { DateUtils } from 'src/app/shared/date-utils';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  isLoading = false;

  companies: Company[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'cnpj',
    'foundationDate',
    'actions',
  ];

  filterForm: FormGroup;

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private dateUtils: DateUtils,
    private toastr: ToastrService,
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      cnpj: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;

    this.companyService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => (this.companies = data),
        error: (err) => {
          console.error(err);
          this.toastr.error('Erro ao carregar empresas.', 'Erro');
        },
      });
  }

  onFilter(): void {
    const payload: CompanyFilter = {
      name: String(this.filterForm.value.name),
      cnpj: this.filterForm.value.cnpj,
      startDate: this.dateUtils.formatDateForFilter(
        this.filterForm.value.startDate,
      ),
      endDate: this.dateUtils.formatDateForFilter(
        this.filterForm.value.endDate,
      ),
    };

    this.isLoading = true;

    this.companyService
      .getByFilters(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => (this.companies = data),
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

  clearFilter(): void {
    this.filterForm.reset();
  }

  deleteCompany(id: number): void {
    Swal.fire({
      title: 'Deseja excluir esta empresa?',
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

        this.companyService
          .delete(id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: () => {
              this.toastr.success('Deletado com sucesso.', 'Sucesso!');
              this.loadCompanies();
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
