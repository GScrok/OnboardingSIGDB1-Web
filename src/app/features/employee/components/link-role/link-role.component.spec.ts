import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LinkRoleComponent } from './link-role.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'src/app/features/role/services/role.service';
import { EmployeeService } from '../../services/employee.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { of, throwError } from 'rxjs';
import { AppRoutes } from 'src/app/shared/app-routes.config';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LinkRoleComponent', () => {
  let component: LinkRoleComponent;
  let fixture: ComponentFixture<LinkRoleComponent>;

  const mockRoleService = { getByFilters: jest.fn() };
  const mockEmployeeService = {
    getById: jest.fn(),
    save: jest.fn(),
    linkRole: jest.fn(),
  };
  const mockActivatedRoute = { snapshot: { paramMap: { get: jest.fn() } } };
  const mockRouter = { navigate: jest.fn() };
  const mockNotification = { success: jest.fn(), error: jest.fn() };
  const mockErrorHandling = {
    handleGenericError: jest.fn(),
    handleErrors: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BrowserAnimationsModule
      ],

      declarations: [LinkRoleComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotification },
        { provide: ErrorHandlingService, useValue: mockErrorHandling },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LinkRoleComponent);
    component = fixture.componentInstance;

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar os formulários corretamente', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');
    mockEmployeeService.getById.mockReturnValue(of({ id: 1, name: 'Test' }));
    mockRoleService.getByFilters.mockReturnValue(of([]));

    component.ngOnInit();

    expect(component.roleFilter).toBeDefined();
    expect(component.employeeRoleForm).toBeDefined();
    expect(mockEmployeeService.getById).toHaveBeenCalledWith(1);
    expect(mockRoleService.getByFilters).toHaveBeenCalledWith(
      component.roleFilter.value,
    );
  });

  it('deve lidar com erro de não possuir ID na rota', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue(null);

    component.ngOnInit();

    expect(mockNotification.error).toHaveBeenCalledWith(
      'Necessário informar o id na rota de pesquisa',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      AppRoutes.LINKS.EMPLOYEE.LIST,
    );
  });

  it('deve carregar o funcionário e os papéis corretamente', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');

    const mockEmployee = { id: 1, name: 'Usuário Teste' };
    const mockRoles = [
      { id: 1, name: 'Desenvolvedor Front-End' },
      { id: 2, name: 'Gerente de Projetos' },
    ];

    mockEmployeeService.getById.mockReturnValue(of(mockEmployee));
    mockRoleService.getByFilters.mockReturnValue(of(mockRoles));

    component.ngOnInit();

    expect(component.employee).toEqual(mockEmployee);
    expect(component.roles).toEqual(mockRoles);
  });

  it('deve lidar com erro ao carregar funcionário', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');

    mockEmployeeService.getById.mockReturnValue(
      throwError(() => new Error('Erro ao carregar funcionário')),
    );

    component.ngOnInit();

    expect(mockErrorHandling.handleGenericError).toHaveBeenCalledWith(
      AppRoutes.PATHS.EMPLOYEE.ROOT,
    );
  });

  it('deve lidar com erro ao carregar papéis', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');

    mockEmployeeService.getById.mockReturnValue(
      of({ id: 1, name: 'Usuário Teste' }),
    );

    mockRoleService.getByFilters.mockReturnValue(
      throwError(() => new Error('Erro ao carregar papéis')),
    );

    component.ngOnInit();

    expect(mockNotification.error).toHaveBeenCalledWith(
      'Ocorreu um erro inesperado.',
    );

    expect(component.roles).toEqual([]);
  });

  it('deve barrar o envio do formulário quando estiver inválido', () => {
    component.ngOnInit();

    component.employeeRoleForm.patchValue({
      roleId: null,
      startDate: null,
    });

    component.onSave();

    expect(component.employeeRoleForm.valid).toBe(false);

    expect(mockEmployeeService.linkRole).not.toHaveBeenCalled();
  });

  it('deve mostrar os erros do formulário quando o formulário for inválido', () => {
    component.ngOnInit();

    component.employeeRoleForm.patchValue({
      roleId: null,
      startDate: null,
    });

    component.onSave();

    fixture.detectChanges();

    expect(component.employeeRoleForm.invalid).toBe(true);

    expect(component.employeeRoleForm.get('roleId')?.hasError('required')).toBe(
      true,
    );

    expect(
      component.employeeRoleForm.get('startDate')?.hasError('required'),
    ).toBe(true);
  });

  it('deve salvar a vinculação do cargo ao funcionário e navegar para a lista', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');

    mockEmployeeService.getById.mockReturnValue(
      of({ id: 1, name: 'Usuário Teste' }),
    );

    component.ngOnInit();

    component.employeeRoleForm.patchValue({
      roleId: 2,
      startDate: new Date('2024-01-01'),
    });

    mockEmployeeService.linkRole.mockReturnValue(of({}));

    component.onSave();

    expect(mockEmployeeService.linkRole).toHaveBeenCalledWith(1, {
      roleId: 2,
      startDate: new Date('2024-01-01'),
    });

    expect(mockNotification.success).toHaveBeenCalledWith(
      'Vinculado com sucesso',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      AppRoutes.LINKS.EMPLOYEE.LIST,
    );
  });

  it('deve lidar com erro ao salvar a vinculação do cargo', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');

    mockEmployeeService.getById.mockReturnValue(
      of({ id: 1, name: 'Usuário Teste' }),
    );

    component.ngOnInit();

    component.employeeRoleForm.patchValue({
      roleId: 2,
      startDate: new Date('2024-01-01'),
    });

    mockEmployeeService.linkRole.mockReturnValue(
      throwError(() => new Error('Erro ao salvar')),
    );

    component.onSave();

    expect(mockEmployeeService.linkRole).toHaveBeenCalledWith(1, {
      roleId: 2,
      startDate: new Date('2024-01-01'),
    });

    expect(mockErrorHandling.handleErrors).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
