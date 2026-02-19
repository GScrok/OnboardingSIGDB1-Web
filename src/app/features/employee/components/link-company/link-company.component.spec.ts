import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LinkCompanyComponent } from './link-company.component';
import { CompanyService } from 'src/app/features/company/services/company.service';
import { EmployeeService } from '../../services/employee.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { AppRoutes } from 'src/app/shared/app-routes.config';

describe('LinkCompanyComponent', () => {
  let component: LinkCompanyComponent;
  let fixture: ComponentFixture<LinkCompanyComponent>;

  const mockCompanyService = { getByFilters: jest.fn() };
  const mockEmployeeService = {
    getById: jest.fn(),
    update: jest.fn(),
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
      ],
      declarations: [LinkCompanyComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotification },
        { provide: ErrorHandlingService, useValue: mockErrorHandling },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LinkCompanyComponent);
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
    mockCompanyService.getByFilters.mockReturnValue(of([]));

    component.ngOnInit();

    expect(component.companyFilter).toBeDefined();
    expect(component.employeeForm).toBeDefined();
    expect(mockEmployeeService.getById).toHaveBeenCalledWith(1);
    expect(mockCompanyService.getByFilters).toHaveBeenCalledWith(
      component.companyFilter.value,
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

  it('deve carregar o funcionário e as empresas corretamente', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');

    const mockEmployee = { id: 1, name: 'Usuário Teste' };
    const mockCompanies = [
      { id: 1, name: 'Empresa A' },
      { id: 2, name: 'Empresa B' },
    ];

    mockEmployeeService.getById.mockReturnValue(of(mockEmployee));
    mockCompanyService.getByFilters.mockReturnValue(of(mockCompanies));

    component.ngOnInit();

    expect(component.employee).toEqual(mockEmployee);
    expect(component.companies).toEqual(mockCompanies);
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

  it('deve lidar com erro ao carregar empresas', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');

    mockEmployeeService.getById.mockReturnValue(
      of({ id: 1, name: 'Usuário Teste' }),
    );

    mockCompanyService.getByFilters.mockReturnValue(
      throwError(() => new Error('Erro ao carregar empresas')),
    );

    component.ngOnInit();

    expect(mockErrorHandling.handleGenericError).toHaveBeenCalled();
    expect(component.companies).toEqual([]);
  });

  it('deve barrar o envio do formulário quando estiver inválido', () => {
    component.ngOnInit();

    component.employeeForm.patchValue({
      companyId: null,
    });

    component.onSave();

    expect(component.employeeForm.valid).toBe(false);
    expect(mockEmployeeService.update).not.toHaveBeenCalled();
  });

  it('deve mostrar os erros do formulário quando o formulário for inválido', () => {
    component.ngOnInit();

    component.employeeForm.patchValue({
      companyId: null,
    });

    component.onSave();

    expect(component.employeeForm.invalid).toBe(true);

    expect(component.employeeForm.get('companyId')?.hasError('required')).toBe(
      true,
    );
  });

  it('deve salvar a vinculação da empresa ao funcionário e navegar para a lista', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');

    const mockEmployee = { id: 1, name: 'Usuário Teste', companyId: null };

    mockEmployeeService.getById.mockReturnValue(of(mockEmployee));
    mockCompanyService.getByFilters.mockReturnValue(of([]));

    component.ngOnInit();

    component.employeeForm.patchValue({
      companyId: 2,
    });

    mockEmployeeService.update.mockReturnValue(of({}));

    component.onSave();

    expect(component.employee!.companyId).toBe(2);

    expect(mockEmployeeService.update).toHaveBeenCalledWith(component.employee);

    expect(mockNotification.success).toHaveBeenCalledWith(
      'Vinculado com sucesso',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      AppRoutes.LINKS.EMPLOYEE.LIST,
    );
  });

  it('deve lidar com erro ao salvar a vinculação da empresa', () => {
    jest
      .spyOn(mockActivatedRoute.snapshot.paramMap, 'get')
      .mockReturnValue('1');

    mockEmployeeService.getById.mockReturnValue(
      of({ id: 1, name: 'Usuário Teste', companyId: null }),
    );
    mockCompanyService.getByFilters.mockReturnValue(of([]));

    component.ngOnInit();

    component.employeeForm.patchValue({
      companyId: 2,
    });

    mockEmployeeService.update.mockReturnValue(
      throwError(() => new Error('Erro ao salvar')),
    );

    component.onSave();

    expect(mockEmployeeService.update).toHaveBeenCalled();
    expect(mockErrorHandling.handleErrors).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('deve voltar para a lista ao clicar em cancelar', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      AppRoutes.LINKS.EMPLOYEE.LIST,
    );
  });
});
