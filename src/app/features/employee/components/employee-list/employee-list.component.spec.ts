import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../../services/employee.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { DateUtils } from 'src/app/shared/date-utils';
import { of, throwError } from 'rxjs';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;

  const mockEmployeeService = {
    getAll: jest.fn(),
    getByFilters: jest.fn(),
    delete: jest.fn(),
  };
  const mockNotification = {
    success: jest.fn(),
    confirmation: jest.fn(),
  };
  const mockError = { handleGenericError: jest.fn(), handleErrors: jest.fn() };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: NotificationService, useValue: mockNotification },
        { provide: ErrorHandlingService, useValue: mockError },
        {
          provide: DateUtils,
          useValue: { formatDate: jest.fn(), formatDateForFilter: jest.fn() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;

    jest.clearAllMocks();
  });

  it('deve carregar a lista de empresas ao iniciar', () => {
    const mockEmployees = [
      {
        id: 1,
        name: 'Funcionário A',
        cpf: '123',
        hiringDate: '01/01/2020',
        companyId: 1,
        companyName: 'Empresa A',
        lastRole: 'Cargo A',
      },
      {
        id: 2,
        name: 'Funcionário B',
        cpf: '456',
        hiringDate: '01/02/2020',
        companyId: 2,
        companyName: 'Empresa B',
        lastRole: 'Cargo B',
      },
    ];

    mockEmployeeService.getAll.mockReturnValue(of(mockEmployees));

    component.ngOnInit();

    expect(mockEmployeeService.getAll).toHaveBeenCalled();
    expect(component.employees).toEqual(mockEmployees);
  });

  it('deve lidar com erros ao carregar a lista de empresas', () => {
    mockEmployeeService.getAll.mockReturnValue(
      throwError(() => new Error('Erro 500')),
    );

    component.ngOnInit();

    expect(component.employees).toEqual([]);

    expect(mockError.handleGenericError).toHaveBeenCalled();
  });

  it('deve filtrar as empresas com base nos critérios de filtro', () => {
    const payload = {
      name: 'Funcionário A',
      cpf: '123',
      startDate: '2020-01-01',
      endDate: '2020-12-31',
    };

    const mockFilteredEmployees = [
      {
        id: 1,
        name: 'Funcionário A',
        cpf: '123',
        hiringDate: '01/01/2020',
        companyId: 1,
        companyName: 'Empresa A',
        lastRole: 'Cargo A',
      },
    ];

    component.ngOnInit();

    component.filterForm.patchValue({
      name: payload.name,
      cpf: payload.cpf,
      startDate: payload.startDate,
      endDate: payload.endDate,
    });

    fixture.detectChanges();

    mockEmployeeService.getByFilters.mockReturnValue(of(mockFilteredEmployees));

    component.onFilter();

    expect(mockEmployeeService.getByFilters).toHaveBeenCalled();
    expect(component.employees).toEqual(mockFilteredEmployees);
  });

  it('deve retornar erro ao filtrar as empresas com base nos critérios de filtro', () => {
    const payload = {
      name: 'Funcionário A',
      cpf: '123',
      startDate: '2020-01-01',
      endDate: '2020-12-31',
    };

    component.ngOnInit();

    component.filterForm.patchValue({
      name: payload.name,
      cpf: payload.cpf,
      startDate: payload.startDate,
      endDate: payload.endDate,
    });

    fixture.detectChanges();

    mockEmployeeService.getByFilters.mockReturnValue(
      throwError(() => new Error('Erro 500')),
    );

    component.onFilter();

    expect(component.employees).toEqual([]);

    expect(mockError.handleGenericError).toHaveBeenCalled();
  });

  it('deve excluir uma empresa e atualizar a lista', async () => {
    let mockEmployees = [
      {
        id: 1,
        name: 'Funcionário A',
        cpf: '123',
        hiringDate: '01/01/2020',
        companyId: 1,
        companyName: 'Empresa A',
        lastRole: 'Cargo A',
      },
      {
        id: 2,
        name: 'Funcionário B',
        cpf: '456',
        hiringDate: '01/02/2020',

        companyId: 2,
        companyName: 'Empresa B',
        lastRole: 'Cargo B',
      },
    ];

    mockEmployeeService.getAll.mockReturnValue(of(mockEmployees));

    component.ngOnInit();

    mockEmployeeService.delete.mockReturnValue(of({}));

    mockNotification.confirmation.mockResolvedValue({ isConfirmed: true });

    await component.deleteEmployee(1);

    expect(mockEmployeeService.delete).toHaveBeenCalledWith(1);

    mockEmployees = [
      {
        id: 2,
        name: 'Funcionário B',
        cpf: '456',
        hiringDate: '01/02/2020',
        companyId: 2,
        companyName: 'Empresa B',
        lastRole: 'Cargo B',
      },
    ];

    mockEmployeeService.getAll.mockReturnValue(of(mockEmployees));

    fixture.detectChanges();

    expect(component.employees).toEqual(mockEmployees);

    expect(mockNotification.success).toHaveBeenCalledWith(
      'Deletado com sucesso.',
    );
  });

  it('deve retornar a empresa para a lista se a exclusão for cancelada', async () => {
    let mockEmployees = [
      {
        id: 1,
        name: 'Funcionário A',
        cpf: '123',
        hiringDate: '01/01/2020',
        companyId: 1,
        companyName: 'Empresa A',
        lastRole: 'Cargo A',
      },
      {
        id: 2,
        name: 'Funcionário B',
        cpf: '456',
        hiringDate: '01/02/2020',
        companyId: 2,
        companyName: 'Empresa B',
        lastRole: 'Cargo B',
      },
    ];

    mockEmployeeService.getAll.mockReturnValue(of(mockEmployees));

    component.ngOnInit();

    mockNotification.confirmation.mockResolvedValue({ isConfirmed: false });

    fixture.detectChanges();

    await component.deleteEmployee(1);

    expect(mockEmployeeService.delete).not.toHaveBeenCalled();

    expect(component.employees).toEqual(mockEmployees);
  });
});
