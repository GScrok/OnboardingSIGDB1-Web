import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleListComponent } from './role-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppRoutes } from 'src/app/shared/app-routes.config';

describe('RoleListComponent', () => {
  let component: RoleListComponent;
  let fixture: ComponentFixture<RoleListComponent>;

  const mockRoleService = {
    getAll: jest.fn(),
    getByFilters: jest.fn(),
    delete: jest.fn(),
  };

  const mockRouter = { navigate: jest.fn() };
  const mockNotification = { success: jest.fn(), confirmation: jest.fn() };
  const mockError = { handleGenericError: jest.fn(), handleErrors: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleListComponent],
      providers: [
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        { provide: NotificationService, useValue: mockNotification },
        { provide: ErrorHandlingService, useValue: mockError },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(RoleListComponent);
    component = fixture.componentInstance;

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar a lista de cargos ao iniciar', () => {
    const mockRoles = [
      { id: 1, description: 'Cargo A' },
      { id: 2, description: 'Cargo B' },
    ];

    mockRoleService.getAll.mockReturnValue(of(mockRoles));

    component.ngOnInit();

    expect(component.roles).toEqual(mockRoles);
    expect(mockRoleService.getAll).toHaveBeenCalled();
  });

  it('deve lidar com erro ao carregar a lista de cargos', () => {
    mockRoleService.getAll.mockReturnValue(throwError(() => new Error('Erro')));

    component.ngOnInit();

    expect(component.roles).toEqual([]);

    expect(mockError.handleGenericError).toHaveBeenCalled();
  });

  it('deve filtrar as empresas com base nos critérios de filtro', () => {
    const payload = { description: 'Cargo A' };

    const mockFilteredRoles = [{ id: 1, description: 'Cargo A' }];

    mockRoleService.getByFilters.mockReturnValue(of(mockFilteredRoles));

    component.ngOnInit();

    fixture.detectChanges();

    component.filterForm.setValue(payload);

    component.onFilter();

    expect(mockRoleService.getByFilters).toHaveBeenCalledWith(payload);

    expect(component.roles).toEqual(mockFilteredRoles);
  });

  it('deve retornar erro ao filtrar as empresas com base nos critérios de filtro', () => {
    const payload = { description: 'Cargo A' };

    mockRoleService.getByFilters.mockReturnValue(
      throwError(() => new Error('Erro')),
    );

    component.ngOnInit();

    fixture.detectChanges();

    component.filterForm.setValue(payload);

    component.onFilter();

    expect(mockRoleService.getByFilters).toHaveBeenCalledWith(payload);
    expect(mockError.handleGenericError).toHaveBeenCalled();
  });

  it('deve excluir um cargo e atualizar a lista', async () => {
    const roleId = 1;

    mockNotification.confirmation.mockResolvedValue({ isConfirmed: true });

    mockRoleService.delete.mockReturnValue(of({}));

    component.ngOnInit();

    await component.deleteRole(roleId);

    expect(mockRoleService.delete).toHaveBeenCalledWith(roleId);
    expect(mockNotification.success).toHaveBeenCalledWith(
      'Deletado com sucesso.',
    );
    expect(mockRoleService.getAll).toHaveBeenCalled();
  });

  it('deve retornar para a lista de cargos sem excluir quando a confirmação for cancelada', async () => {
    const roleId = 1;

    mockNotification.confirmation.mockResolvedValue({ isConfirmed: false });

    await component.deleteRole(roleId);

    expect(mockRoleService.delete).not.toHaveBeenCalled();
    expect(mockNotification.success).not.toHaveBeenCalled();
    expect(mockRoleService.getAll).not.toHaveBeenCalled();
  });
});
