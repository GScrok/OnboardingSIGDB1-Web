import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { EmployeeService } from './../../services/employee.service';
import { EmployeeRoleHistory } from '../../models/employee-role-history.model';

@Component({
  selector: 'app-employee-role-history',
  templateUrl: './employee-role-history.component.html',
  styleUrls: ['./employee-role-history.component.scss'],
})
export class EmployeeRoleHistoryComponent implements OnInit {
  protected routes = AppRoutes;

  employeeRoleHistory: EmployeeRoleHistory[] = [];

  employeeId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = Number(id);

      this.getRoleHistory(this.employeeId);
    } else {
      this.onError();
    }
  }

  private onError() {
    this.notificationService.error(
      'Necessário informar o id na rota de pesquisa'
    );

    this.router.navigate(this.routes.LINKS.EMPLOYEE.LIST);
  }

  private getRoleHistory(employeeId: number) {
    this.employeeService
      .getRoleHistory(employeeId)
      .subscribe({
        next: (data) => (this.employeeRoleHistory = data),
        error: (err) => this.errorHandlingService.handleErrors(err, this.routes.PATHS.EMPLOYEE.ROOT),
      });
  }
}
