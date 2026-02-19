import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve iniciar com o loading desativado (false)', (done) => {
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBe(false);
      done();
    });
  });

  it('deve emitir true quando show() for chamado', (done) => {
    service.show();

    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBe(true);
      done();
    });
  });

  it('deve emitir false quando hide() for chamado após um show()', (done) => {
    service.show();
    service.hide();

    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBe(false);
      done();
    });
  });

  describe('Lógica de múltiplas requisições simultâneas', () => {
    it('deve manter o loading ativo (true) se ainda houver requisições pendentes', (done) => {
      service.show();
      service.show();
      service.hide();

      service.isLoading$.subscribe((isLoading) => {
        expect(isLoading).toBe(true);
        done();
      });
    });

    it('deve desativar o loading (false) apenas quando todas as requisições terminarem', (done) => {
      service.show();
      service.show();
      service.show();

      service.hide();
      service.hide();
      service.hide();

      service.isLoading$.subscribe((isLoading) => {
        expect(isLoading).toBe(false);
        done();
      });
    });

    it('não deve deixar o contador ficar negativo se hide() for chamado mais vezes que show()', (done) => {
      service.hide();
      service.hide();
      service.hide();

      service.isLoading$.subscribe((isLoading) => {
        expect(isLoading).toBe(false);
        done();
      });
    });
  });
});
