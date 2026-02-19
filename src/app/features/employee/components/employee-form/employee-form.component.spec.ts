import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFormComponent } from './employee-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { DateUtils } from 'src/app/shared/date-utils';
import { of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AppRoutes } from 'src/app/shared/app-routes.config';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;

  const mockEmployeeService = { getById: jest.fn(), save: jest.fn() };
  const mockRouter = { navigate: jest.fn() };
  const mockNotification = { success: jest.fn() };
  const mockError = { handleGenericError: jest.fn(), handleErrors: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [EmployeeFormComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotification },
        { provide: ErrorHandlingService, useValue: mockError },
        { provide: DateUtils, useValue: { formatDate: jest.fn() } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar em modo de criação quando não houver ID na rota', () => {
    fixture.detectChanges();

    expect(component.isEditMode).toBe(false);
    expect(component.employeeId).toBeNull();

    expect(component.employeeForm.get('name')?.value).toBe('');
  });

  it('deve carregar dados do funcionário e entrar em modo de edição quando houver ID na rota', () => {
    const route = TestBed.inject(ActivatedRoute);
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('123');

    const mockEmployee = {
      id: 123,
      name: 'Funcionário Teste',
      cpf: '123',
      hiringDate: '01/01/1990',
    };

    mockEmployeeService.getById.mockReturnValue(of(mockEmployee));

    fixture.detectChanges();

    expect(component.isEditMode).toBe(true);
    expect(component.employeeId).toBe(123);

    expect(component.employeeForm.get('name')?.value).toBe('Funcionário Teste');
    expect(component.employeeForm.get('cpf')?.value).toBe('123');
    expect(component.employeeForm.get('hiringDate')?.value).toBe('01/01/1990');

    expect(mockEmployeeService.getById).toHaveBeenCalledWith(123);
  });

  it('deve salvar nova empresa e navegar para a lista', () => {
    fixture.detectChanges();

    component.employeeForm.patchValue({
      name: 'Novo Funcionário',
      cpf: '456',
      hiringDate: '01/01/1995',
    });

    (TestBed.inject(DateUtils).formatDate as jest.Mock).mockReturnValue(
      '01/01/1995',
    );

    mockEmployeeService.save.mockReturnValue(of({}));

    component.onSave();
    expect(mockEmployeeService.save).toHaveBeenCalledWith({
      name: 'Novo Funcionário',
      cpf: '456',
      hiringDate: '01/01/1995',
      companyId: null,
    });

    expect(mockNotification.success).toHaveBeenCalledWith('Salvo com sucesso');
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      AppRoutes.LINKS.EMPLOYEE.LIST,
    );
  });

  it('deve retornar os erros no formulário quando o formulário for inválido', () => {
    fixture.detectChanges();

    component.onSave();

    expect(component.employeeForm.invalid).toBe(true);

    expect(component.employeeForm.get('name')?.hasError('required')).toBe(true);
    expect(component.employeeForm.get('cpf')?.hasError('required')).toBe(true);

    let elementHtml = fixture.nativeElement as HTMLElement;

    expect(elementHtml.querySelector('#errorNameRequired')?.textContent).toContain('Campo obrigatório');
    expect(elementHtml.querySelector('#errorCpfRequired')?.textContent).toContain('Campo obrigatório');
  });

  it('deve liberar botão de salvar quando o formulário for válido', () => {
    fixture.detectChanges();

    let elementHtml = fixture.nativeElement as HTMLElement;
    const saveButton = elementHtml.querySelector('button[type="submit"]') as HTMLButtonElement;

    component.employeeForm.patchValue({
      name: 'Funcionário Teste',
      cpf: '123.456.789-00',
      hiringDate: '01/01/1990',
    });

    fixture.detectChanges();

    expect(saveButton.disabled).toBe(false);
  });

  it('deve travar botão de salvar quando o formulário for inválido', () => {
    fixture.detectChanges();

    let elementHtml = fixture.nativeElement as HTMLElement;
    const saveButton = elementHtml.querySelector('button[type="submit"]') as HTMLButtonElement;

    component.employeeForm.patchValue({
      name: '',
      cpf: '',
      hiringDate: '',
    });

    fixture.detectChanges();

    expect(saveButton.disabled).toBe(true);
  });

  it('deve navegar para a lista ao cancelar', () => {
    fixture.detectChanges();

    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(AppRoutes.LINKS.EMPLOYEE.LIST);
  });
});
