import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { Company } from '../../models/company.model';

import { DateUtils } from 'src/app/shared/date-utils';

import { CompanyService } from '../../services/company.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
})
export class CompanyFormComponent implements OnInit {
  public readonly routes = AppRoutes;

  companyForm!: FormGroup;
  isEditMode: boolean = false;
  companyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private dateUtils: DateUtils,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  ngOnInit(): void {
    this.buildCleanCompanyForm();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.setEditMode(id);

      this.loadCompany(this.companyId!);
    }
  }

  private setEditMode(id: string) {
    this.isEditMode = true;
    this.companyId = Number(id);
  }

  private loadCompany(id: number): void {

    this.companyService
      .getById(id)
      .subscribe({
        next: (company) => {
          this.companyForm.patchValue(company);
        },
        error: () => {
          this.errorHandlingService.handleGenericError(this.routes.PATHS.COMPANY.ROOT);
        },
      });
  }

  public onSave(): void {
    if (!this.isFormValid()) {
      return;
    }

    const company = this.createPayloadCompany();

    this.saveCompany(company);
  }

  private isFormValid(): boolean {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  private saveCompany(company: Company) {
    this.companyService
      .save(company)
      .subscribe({
        next: () => this.onSuccess(),
        error: (error) => this.errorHandlingService.handleErrors(error),
      });
  }

  private createPayloadCompany(): Company {
    return {
      id: this.companyId,
      name: this.companyForm.value.name,
      cnpj: this.companyForm.value.cnpj,
      foundationDate: this.dateUtils.formatDate(
        this.companyForm.value.foundationDate,
      ),
    };
  }

  private onSuccess(): void {
    this.notificationService.success('Salvo com sucesso');
    this.router.navigate(this.routes.LINKS.COMPANY.LIST);
  }

  public onCancel(): void {
    this.router.navigate(this.routes.LINKS.COMPANY.LIST);
  }

  private buildCleanCompanyForm() {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      cnpj: ['', [Validators.required]],
      foundationDate: [''],
    });
  }
}
