import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ToastrService, useValue: mockToastrService },
      ],
    });

    service = TestBed.inject(NotificationService);

    jest.clearAllMocks();
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  describe('Métodos do Toastr', () => {
    it('deve chamar o toastr.success com a mensagem correta', () => {
      const message = 'Operação realizada com sucesso!';

      service.success(message);

      expect(mockToastrService.success).toHaveBeenCalledWith(message);
      expect(mockToastrService.error).not.toHaveBeenCalled();
    });

    it('deve chamar o toastr.error com a mensagem correta', () => {
      const message = 'Falha ao realizar operação!';

      service.error(message);

      expect(mockToastrService.error).toHaveBeenCalledWith(message);
      expect(mockToastrService.success).not.toHaveBeenCalled();
    });
  });
});
