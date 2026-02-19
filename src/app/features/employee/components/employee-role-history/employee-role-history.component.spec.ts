import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EmployeeRoleHistoryComponent } from './employee-role-history.component';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { of, throwError } from 'rxjs';
import { AppRoutes } from 'src/app/shared/app-routes.config';

describe('EmployeeRoleHistoryComponent', () => {
  let component: EmployeeRoleHistoryComponent;
  let fixture: ComponentFixture<EmployeeRoleHistoryComponent>;

  const mockEmployeeService = { getRoleHistory: jest.fn() };
  const mockActivatedRoute = { snapshot: { paramMap: { get: jest.fn() } } };
  const mockRouter = { navigate: jest.fn() };
  const mockNotification = { error: jest.fn() };
  const mockErrorHandling = { handleErrors: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeRoleHistoryComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NotificationService, useValue: mockNotification },
        { provide: ErrorHandlingService, useValue: mockErrorHandling },
      ],
    });

    fixture = TestBed.createComponent(EmployeeRoleHistoryComponent);
    component = fixture.componentInstance;

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve obter o histórico de cargos do funcionário ao inicializar', () => {
    const mockRoleHistory = [
      { role: 'Developer', startDate: '2020-01-01', endDate: '2021-01-01' },
      { role: 'Senior Developer', startDate: '2021-02-01', endDate: null },
    ];
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');
    mockEmployeeService.getRoleHistory.mockReturnValue(of(mockRoleHistory));

    component.ngOnInit();

    expect(mockEmployeeService.getRoleHistory).toHaveBeenCalledWith(1);
    expect(component.employeeRoleHistory).toEqual(mockRoleHistory);
  });

  it('deve exibir erro e redirecionar se o id não for informado na rota', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(null);

    component.ngOnInit();

    expect(mockNotification.error).toHaveBeenCalledWith(
      'Necessário informar o id na rota de pesquisa',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      AppRoutes.LINKS.EMPLOYEE.LIST,
    );
  });

  it('deve lidar com erro ao obter o histórico de cargos', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');

    mockEmployeeService.getRoleHistory.mockReturnValue(
      throwError(() => new Error('Erro ao obter histórico de cargos')),
    );

    component.ngOnInit();

    expect(mockErrorHandling.handleErrors).toHaveBeenCalledWith(
      new Error('Erro ao obter histórico de cargos'),
      AppRoutes.PATHS.EMPLOYEE.ROOT,
    );
  });
});
