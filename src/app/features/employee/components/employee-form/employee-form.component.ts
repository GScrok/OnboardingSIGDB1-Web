import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { Employee } from '../../models/employee.model';

import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from 'src/app/core/notification/notification.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  protected routes = AppRoutes ;

  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  ngOnInit(): void {
    this.buildCleanEmployeeForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.setEditMode(id);

      this.loadEmployeeById(this.employeeId!);
    }
  }

  private setEditMode(id: string) {
    this.isEditMode = true;
    this.employeeId = Number(id);
  }

  private loadEmployeeById(employeeId: number) {
    this.employeeService
      .getById(employeeId)
      .subscribe({
        next: (emp) => {
          this.employeeForm.patchValue(emp);
        },
        error: (err) => {
          this.errorHandlingService.handleErrors(err, this.routes.PATHS.EMPLOYEE.ROOT);
        },
      });
  }

  private buildCleanEmployeeForm() {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      cpf: ['', [Validators.required]],
      hiringDate: [null],
      companyId: [null],
    });
  }

  public onSave(): void {
    if (!this.isFormValid()) {
      return;
    }

    const employee: Employee = this.employeeForm.value;

    this.saveEmployee(employee);
  }

  private isFormValid(): boolean {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  private saveEmployee(employee: Employee) {
    this.employeeService
      .save(employee)
      .subscribe({
        next: () => this.onSuccess(),
        error: (err) => {
          this.errorHandlingService.handleErrors(err);
        },
      });
  }

  private onSuccess(): void {
    this.notificationService.success('Salvo com sucesso');
    this.router.navigate(this.routes.LINKS.EMPLOYEE.LIST);
  }

  public onCancel(): void {
    this.router.navigate(this.routes.LINKS.EMPLOYEE.LIST);
  }
}
