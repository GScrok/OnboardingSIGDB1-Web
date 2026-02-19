import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { EmployeeService } from './employee.service';
import { environment } from 'src/environments/environment.development';
import { EmployeeRole } from '../models/employee-role.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService],
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve repassar a URL correta (/funcionarios) para o BaseService', () => {
    service.getAll().subscribe();

    const expectedUrl = `${environment.apiUrl}/funcionarios`;

    const req = httpMock.expectOne(expectedUrl);

    expect(req.request.method).toBe('GET');

    req.flush({ data: [], success: true, message: 'Sucesso' });
  });

  it('deve linkar um cargo a um funcionário', () => {
    const employeeId = 1;

    const employeeRole: EmployeeRole = { roleId: 2, starDate: '2024-01-01' };

    service.linkRole(employeeId, employeeRole).subscribe((response) => {
      expect(response).toEqual(employeeRole);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/funcionarios/${employeeId}/cargos`,
    );

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(employeeRole);

    req.flush({
      data: employeeRole,
      success: true,
      message: 'Cargo vinculado com sucesso',
    });
  });

  it('deve obter o histórico de cargos de um funcionário', () => {
    const employeeId = 1;
    const roleHistory = [
      { roleId: 2, starDate: '2024-01-01' },
      { roleId: 3, starDate: '2024-02-01' },
    ];

    service.getRoleHistory(employeeId).subscribe((response) => {
      expect(response).toEqual(roleHistory);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/funcionarios/${employeeId}/cargos`,
    );

    expect(req.request.method).toBe('GET');

    req.flush({
      data: roleHistory,
      success: true,
      message: 'Histórico de cargos obtido com sucesso',
    });
  });
});
