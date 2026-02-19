import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFormComponent } from './company-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { DateUtils } from 'src/app/shared/date-utils';
import { CompanyService } from '../../services/company.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CompanyFormComponent', () => {
  let component: CompanyFormComponent;
  let fixture: ComponentFixture<CompanyFormComponent>;

  const mockCompanyService = { getById: jest.fn(), save: jest.fn() };
  const mockRouter = { navigate: jest.fn() };
  const mockNotification = { success: jest.fn() };
  const mockError = { handleGenericError: jest.fn(), handleErrors: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CompanyFormComponent],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
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
    fixture = TestBed.createComponent(CompanyFormComponent);
    component = fixture.componentInstance;
  });

  it('deve iniciar em modo de criação quando não houver ID na rota', () => {
    fixture.detectChanges();

    expect(component.isEditMode).toBe(false);
    expect(component.companyId).toBeNull();

    expect(component.companyForm.get('name')?.value).toBe('');
  });

  it('deve carregar dados da empresa e entrar em modo de edição quando houver ID na rota', () => {
    const route = TestBed.inject(ActivatedRoute);
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('123');

    const mockCompany = {
      id: 123,
      name: 'Empresa Teste',
      cnpj: '123',
      foundationDate: '01/01/2020',
    };
    mockCompanyService.getById.mockReturnValue(of(mockCompany));

    fixture.detectChanges();

    expect(component.isEditMode).toBe(true);
    expect(component.companyId).toBe(123);

    expect(component.companyForm.get('name')?.value).toBe('Empresa Teste');
    expect(mockCompanyService.getById).toHaveBeenCalledWith(123);
  });

  it('deve salvar nova empresa e navegar para a lista', () => {
    fixture.detectChanges();

    component.companyForm.patchValue({
      name: 'Nova Empresa',
      cnpj: '456',
      foundationDate: '01/01/2021',
    });

    (TestBed.inject(DateUtils).formatDate as jest.Mock).mockReturnValue('01/01/2021');

    mockCompanyService.save.mockReturnValue(of({}));

    component.onSave();
    expect(mockCompanyService.save).toHaveBeenCalledWith({
      id: null,
      name: 'Nova Empresa',
      cnpj: '456',
      foundationDate: '01/01/2021',
    });
    expect(mockNotification.success).toHaveBeenCalledWith('Salvo com sucesso');
    expect(mockRouter.navigate).toHaveBeenCalledWith(component.routes.LINKS.COMPANY.LIST);
  });

  it('deve retornar os erros no formulário quando o formulário for inválido', () => {
    fixture.detectChanges();

    component.onSave();

    expect(component.companyForm.invalid).toBe(true);

    expect(component.companyForm.get('name')?.hasError('required')).toBe(true);
    expect(component.companyForm.get('cnpj')?.hasError('required')).toBe(true);

    let elementHtml = fixture.nativeElement as HTMLElement;

    expect(elementHtml.querySelector('#errorNameRequired')?.textContent).toContain('Campo obrigatório');
    expect(elementHtml.querySelector('#errorCnpjRequired')?.textContent).toContain('Campo obrigatório');
  });

  it('deve liberar botão de salvar quando o formulário for válido', () => {
    fixture.detectChanges();

    let elementHtml = fixture.nativeElement as HTMLElement;
    const saveButton = elementHtml.querySelector('button[type="submit"]') as HTMLButtonElement;

    component.companyForm.patchValue({
      name: 'Empresa Válida',
      cnpj: '12345678000199',
      foundationDate: '01/01/2021',
    });
    fixture.detectChanges();

    expect(saveButton.disabled).toBe(false);
  });

  it('deve travar botão de salvar quando o formulário for inválido', () => {
    fixture.detectChanges();

    let elementHtml = fixture.nativeElement as HTMLElement;
    const saveButton = elementHtml.querySelector('button[type="submit"]') as HTMLButtonElement;
    component.companyForm.patchValue({
      name: '',
      cnpj: '',
      foundationDate: '',
    });

    fixture.detectChanges();

    expect(saveButton.disabled).toBe(true);
  });

  it('deve navegar para a lista ao cancelar', () => {
    fixture.detectChanges();

    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(component.routes.LINKS.COMPANY.LIST);
  });
});
