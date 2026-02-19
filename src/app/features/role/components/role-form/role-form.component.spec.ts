import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleFormComponent } from './role-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateUtils } from 'src/app/shared/date-utils';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { RoleService } from '../../services/role.service';
import { of } from 'rxjs';
import { AppRoutes } from 'src/app/shared/app-routes.config';

describe('RoleFormComponent', () => {
  let component: RoleFormComponent;
  let fixture: ComponentFixture<RoleFormComponent>;

  const mockRouter = { navigate: jest.fn() };
  const mockNotification = { success: jest.fn() };
  const mockError = { handleGenericError: jest.fn(), handleErrors: jest.fn() };
  const mockService = { getById: jest.fn(), save: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RoleFormComponent],
      providers: [
        { provide: RoleService, useValue: mockService },
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

    fixture = TestBed.createComponent(RoleFormComponent);
    component = fixture.componentInstance;

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar em modo de criação quando não houver ID na rota', () => {
    fixture.detectChanges();

    expect(component.isEditMode).toBe(false);
    expect(component.roleId).toBeNull();

    expect(component.roleForm.get('description')?.value).toBe('');
  });

  it('deve carregar dados do cargo e entrar em modo de edição quando houver ID na rota', () => {
    component.ngOnInit();

    const route = TestBed.inject(ActivatedRoute);
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('123');

    const mockRole = {
      id: 123,
      description: 'Cargo Teste',
    };

    mockService.getById.mockReturnValue(of(mockRole));

    fixture.detectChanges();

    expect(component.isEditMode).toBe(true);
    expect(component.roleId).toBe(123);

    expect(component.roleForm.get('description')?.value).toBe('Cargo Teste');
    expect(mockService.getById).toHaveBeenCalledWith(123);
  });

  it('deve salvar um novo cargo e navegar para a lista de cargos', () => {
    fixture.detectChanges();
    component.roleForm.patchValue({
      description: 'Novo Cargo',
    });

    mockService.save.mockReturnValue(of({}));

    component.onSave();

    expect(mockService.save).toHaveBeenCalledWith({
      description: 'Novo Cargo',
    });

    expect(mockNotification.success).toHaveBeenCalledWith('Salvo com sucesso');
    expect(mockRouter.navigate).toHaveBeenCalledWith(AppRoutes.LINKS.ROLE.LIST);
  });

  it('deve retornar os erros no formulário quando o formulário for inválido', () => {
    fixture.detectChanges();

    component.onSave();

    expect(component.roleForm.invalid).toBe(true);

    expect(component.roleForm.get('description')?.hasError('required')).toBe(
      true,
    );

    let elementHtml = fixture.nativeElement as HTMLElement;

    expect(
      elementHtml.querySelector('#errorDescriptionRequired')?.textContent,
    ).toContain('Campo obrigatório');
  });

  it('deve liberar botão de salvar quando o formulário for válido', () => {
    fixture.detectChanges();

    let elementHtml = fixture.nativeElement as HTMLElement;
    const saveButton = elementHtml.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    component.roleForm.patchValue({
      description: 'Cargo Válido',
    });

    fixture.detectChanges();

    expect(saveButton.disabled).toBe(false);
  });

  it('deve travar botão de salvar quando o formulário for inválido', () => {
    fixture.detectChanges();

    let elementHtml = fixture.nativeElement as HTMLElement;
    const saveButton = elementHtml.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    component.roleForm.patchValue({
      description: '',
    });

    fixture.detectChanges();

    expect(saveButton.disabled).toBe(true);
  });
  it('deve navegar para a lista ao cancelar', () => {
    fixture.detectChanges();

    component.onCancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(AppRoutes.LINKS.ROLE.LIST);
  });
});
