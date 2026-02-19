import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyListComponent } from './company-list.component';
import { ErrorHandlingService } from 'src/app/core/error-handling/error-handling.service';
import { NotificationService } from 'src/app/core/notification/notification.service';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { DateUtils } from 'src/app/shared/date-utils';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('CompanyListComponent', () => {
  let component: CompanyListComponent;
  let fixture: ComponentFixture<CompanyListComponent>;

  const mockCompanyService = {
    getAll: jest.fn(),
    getByFilters: jest.fn(),
    delete: jest.fn(),
  };

  const mockRouter = { navigate: jest.fn() };
  const mockNotification = {
    success: jest.fn(),
    confirmation: jest.fn(),
  };
  const mockError = { handleGenericError: jest.fn(), handleErrors: jest.fn() };

  beforeEach(() => {
    mockCompanyService.getAll.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [CompanyListComponent],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotification },
        { provide: ErrorHandlingService, useValue: mockError },
        {
          provide: DateUtils,
          useValue: { formatDate: jest.fn(), formatDateForFilter: jest.fn() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CompanyListComponent);
    component = fixture.componentInstance;

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar a lista de empresas ao iniciar', () => {
    const mockCompanies = [
      { id: 1, name: 'Empresa A', cnpj: '123', foundationDate: '01/01/2020' },
      { id: 2, name: 'Empresa B', cnpj: '456', foundationDate: '01/02/2020' },
    ];
    mockCompanyService.getAll.mockReturnValue(of(mockCompanies));

    component.ngOnInit();

    expect(mockCompanyService.getAll).toHaveBeenCalled();
    expect(component.companies).toEqual(mockCompanies);
  });

  it('deve lidar com erros ao carregar a lista de empresas', () => {
    mockCompanyService.getAll.mockReturnValue(
      throwError(() => new Error('Erro 500')),
    );

    component.ngOnInit();

    expect(component.companies).toEqual([]);

    expect(mockError.handleGenericError).toHaveBeenCalled();
  });

  it('deve filtrar as empresas com base nos critérios de filtro', () => {
    const payload = {
      name: 'Empresa A',
      cnpj: '123',
      startDate: '2020-01-01',
      endDate: '2020-12-31',
    };

    let mockFilteredCompanies = [
      { id: 1, name: 'Empresa A', cnpj: '123', foundationDate: '01/01/2020' },
    ];

    component.ngOnInit();

    component.filterForm.patchValue({
      name: payload.name,
      cnpj: payload.cnpj,
      startDate: payload.startDate,
      endDate: payload.endDate,
    });

    fixture.detectChanges();

    mockCompanyService.getByFilters.mockReturnValue(of(mockFilteredCompanies));

    component.onFilter();

    expect(mockCompanyService.getByFilters).toHaveBeenCalled();

    expect(component.companies).toEqual(mockFilteredCompanies);
  });

  it('deve retornar erro ao filtrar as empresas com base nos critérios de filtro', () => {
    const payload = {
      name: 'Empresa A',
      cnpj: '123',
      startDate: '2020-01-01',
      endDate: '2020-12-31',
    };

    component.ngOnInit();

    component.filterForm.patchValue({
      name: payload.name,
      cnpj: payload.cnpj,
      startDate: payload.startDate,
      endDate: payload.endDate,
    });

    fixture.detectChanges();

    mockCompanyService.getByFilters.mockReturnValue(
      throwError(() => new Error('Erro 500')),
    );

    component.onFilter();

    expect(mockError.handleErrors).toHaveBeenCalled();
  });

  it('deve excluir uma empresa e atualizar a lista', async () => {
    let mockCompanies = [
      { id: 1, name: 'Empresa A', cnpj: '123', foundationDate: '01/01/2020' },
      { id: 2, name: 'Empresa B', cnpj: '456', foundationDate: '01/02/2020' },
    ];

    mockCompanyService.getAll.mockReturnValue(of(mockCompanies));

    component.ngOnInit();

    mockCompanyService.delete.mockReturnValue(of({}));

    mockNotification.confirmation.mockResolvedValue({ isConfirmed: true });

    await component.deleteCompany(1);

    expect(mockCompanyService.delete).toHaveBeenCalledWith(1);

    mockCompanies = [
      { id: 2, name: 'Empresa B', cnpj: '456', foundationDate: '01/02/2020' },
    ];

    mockCompanyService.getAll.mockReturnValue(of(mockCompanies));

    fixture.detectChanges();

    expect(component.companies).toEqual(mockCompanies);

    expect(mockNotification.success).toHaveBeenCalledWith(
      'Deletado com sucesso.',
    );
  });

  it('deve retornar a empresa para a lista se a exclusão for cancelada', async () => {
    let mockCompanies = [
      { id: 1, name: 'Empresa A', cnpj: '123', foundationDate: '01/01/2020' },
      { id: 2, name: 'Empresa B', cnpj: '456', foundationDate: '01/02/2020' },
    ];

    mockCompanyService.getAll.mockReturnValue(of(mockCompanies));

    component.ngOnInit();

    mockNotification.confirmation.mockResolvedValue({ isConfirmed: false });

    fixture.detectChanges();

    await component.deleteCompany(1);

    expect(mockCompanyService.delete).not.toHaveBeenCalled();

    expect(component.companies).toEqual(mockCompanies);
  });
});
