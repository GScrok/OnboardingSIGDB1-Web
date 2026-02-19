import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorHandlingService } from './error-handling.service';
import { NotificationService } from './../notification/notification.service';
import { AppRoutes } from 'src/app/shared/app-routes.config';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockNotificationService = {
    error: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });

    service = TestBed.inject(ErrorHandlingService);

    jest.clearAllMocks();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('Método handleGenericError', () => {
    it('deve exibir apenas a notificação genérica se não receber uma rota', () => {
      service.handleGenericError();

      expect(mockNotificationService.error).toHaveBeenCalledWith('Ocorreu um erro inesperado.');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('deve exibir a notificação genérica e navegar se receber uma rota', () => {
      service.handleGenericError(AppRoutes.PATHS.EMPLOYEE.ROOT);

      expect(mockNotificationService.error).toHaveBeenCalledWith('Ocorreu um erro inesperado.');
      expect(mockRouter.navigate).toHaveBeenCalledWith([`/${AppRoutes.PATHS.EMPLOYEE.ROOT}`]);
    });
  });

  describe('Método handleErrors', () => {
    it('deve repassar para o handleGenericError se o erro for nulo ou não possuir a lista "errors"', () => {
      const genericSpy = jest.spyOn(service, 'handleGenericError');

      const erro = new HttpErrorResponse({});

      service.handleErrors(erro, AppRoutes.PATHS.EMPLOYEE.ROOT);

      expect(genericSpy).toHaveBeenCalledWith(AppRoutes.PATHS.EMPLOYEE.ROOT);

      expect(mockNotificationService.error).toHaveBeenCalledWith('Ocorreu um erro inesperado.');
    });

    it('deve repassar para o handleGenericError se a lista "errors" for um array vazio', () => {
      const genericSpy = jest.spyOn(service, 'handleGenericError');

      const erroArrayVazio = { error: { errors: [] } } as HttpErrorResponse;

      service.handleErrors(erroArrayVazio);

      expect(genericSpy).toHaveBeenCalled();
    });

    it('deve exibir múltiplas notificações se receber uma lista de erros específica da API', () => {
      const erroComMensagens = {
        error: {
          errors: ['CPF inválido', 'Data de nascimento obrigatória']
        }
      } as unknown as HttpErrorResponse;

      service.handleErrors(erroComMensagens);

      expect(mockNotificationService.error).toHaveBeenCalledTimes(2);
      expect(mockNotificationService.error).toHaveBeenNthCalledWith(1, 'CPF inválido');
      expect(mockNotificationService.error).toHaveBeenNthCalledWith(2, 'Data de nascimento obrigatória');

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('deve exibir as notificações específicas e navegar se receber uma rota', () => {
      const errorWithMessage = {
        error: {
          errors: ['Sessão expirada']
        }
      } as unknown as HttpErrorResponse;

      service.handleErrors(errorWithMessage, AppRoutes.PATHS.EMPLOYEE.ROOT);

      expect(mockNotificationService.error).toHaveBeenCalledWith('Sessão expirada');
      expect(mockRouter.navigate).toHaveBeenCalledWith([`/${AppRoutes.PATHS.EMPLOYEE.ROOT}`]);
    });
  });
});
