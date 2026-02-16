import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyService } from '../../services/company.service';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { Company } from '../../models/company.model';
import { CompanyFilter } from './../../models/company.filter.model';

import { DateUtils } from 'src/app/shared/date-utils';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  protected routes = AppRoutes;

  companies: Company[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'cnpj',
    'foundationDate',
    'actions',
  ];

  filterForm!: FormGroup;

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private dateUtils: DateUtils,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  ngOnInit(): void {
    this.loadCompanies();

    this.buildCleanCompanyFilter();
  }

  private loadCompanies(): void {
    this.companyService
      .getAll()
      .subscribe({
        next: (data) => (this.companies = data),
        error: () => this.errorHandlingService.handleGenericError(),
      });
  }

  public onFilter(): void {
    const payload: CompanyFilter = this.createPayloadCompanyFilter();

    this.filterCompany(payload);
  }

  private filterCompany(payload: CompanyFilter) {
    this.companyService
      .getByFilters(payload)
      .subscribe({
        next: (data) => (this.companies = data),
        error: (err) => this.errorHandlingService.handleErrors(err),
      });
  }

  private createPayloadCompanyFilter(): CompanyFilter {
    return {
      name: String(this.filterForm.value.name),
      cnpj: this.filterForm.value.cnpj,
      startDate: this.dateUtils.formatDateForFilter(
        this.filterForm.value.startDate,
      ),
      endDate: this.dateUtils.formatDateForFilter(
        this.filterForm.value.endDate,
      ),
    };
  }

  public clearFilter(): void {
    this.buildCleanCompanyFilter();
  }

  public async deleteCompany(id: number): Promise<void> {
    const result = await this.notificationService.confirmation(
      'Deseja excluir esta empresa?',
      'Você não poderá reverter isso!',
    );

    if (result.isConfirmed) {
      this.executeDelete(id);
    }
  }

  private executeDelete(id: number): void {
    this.companyService
      .delete(id)
      .subscribe({
        next: () => {
          this.notificationService.success('Deletado com sucesso.');
          this.loadCompanies();
        },
        error: (err) => this.errorHandlingService.handleErrors(err),
      });
  }

  private buildCleanCompanyFilter() {
    this.filterForm = this.fb.group({
      name: [''],
      cnpj: [''],
      startDate: [''],
      endDate: [''],
    });
  }
}
