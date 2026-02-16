import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Employee } from '../models/employee.model';
import { EmployeeFilter } from '../models/employee.filter.model';
import { EmployeeRole } from '../models/employee-role.model';
import { EmployeeRoleHistory } from '../models/employee-role-history.model';
import { BaseService } from 'src/app/core/base/base.service';

@Injectable()
export class EmployeeService extends BaseService<Employee, EmployeeFilter>{
  private apiPath = `${environment.apiUrl}/funcionarios`;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.apiUrl}/funcionarios`)
  }

  linkRole(id: number, employeeRole: EmployeeRole): Observable<EmployeeRole> {
    return this.http
      .post<any>(`${this.apiPath}/${id}/cargos`, employeeRole)
      .pipe(map((response) => response.data));
  }

  getRoleHistory(id: number): Observable<EmployeeRoleHistory[]> {
    return this.http
      .get<any>(`${this.apiPath}/${id}/cargos`)
      .pipe(map((response) => response.data));
  }
}
