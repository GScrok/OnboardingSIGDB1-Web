import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Employee } from '../models/employee.model';
import { EmployeeFilter } from '../models/employee.filter.model';
import { EmployeeRole } from '../models/employee-role.model';
import { EmployeeRoleHistory } from '../models/employee-role-history.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiPath = `${environment.apiUrl}/funcionarios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http
      .get<any>(this.apiPath)
      .pipe(map((response) => response.data));
  }

  getById(id: number): Observable<Employee> {
    return this.http
      .get<any>(`${this.apiPath}/${id}`)
      .pipe(map((response) => response.data));
  }

  getByFilters(filter: EmployeeFilter): Observable<Employee[]> {
    const options = {
      params: filter as any,
    };

    return this.http
      .get<any>(`${this.apiPath}/pesquisar`, options)
      .pipe(map((response) => response.data));
  }

  create(employee: Employee): Observable<Employee> {
    return this.http
      .post<any>(this.apiPath, employee)
      .pipe(map((response) => response.data));
  }

  update(employee: Employee): Observable<Employee> {
    return this.http
      .put<any>(`${this.apiPath}/${employee.id}`, employee)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
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
