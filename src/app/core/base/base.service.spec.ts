import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { BaseModel } from './base.model';
import { BaseFilterModel } from './base.filter.model';
import { BaseResponseModel } from './base.response.model';

interface DummyModel extends BaseModel {
  id?: number;
  name: string;
}

interface DummyFilter extends BaseFilterModel {
  name?: string;
}

@Injectable()
class DummyService extends BaseService<DummyModel, DummyFilter> {
  constructor(http: HttpClient) {
    super(http, 'http://api.dummy.com/recurso');
  }
}

describe('BaseService', () => {
  let service: DummyService;
  let httpMock: HttpTestingController;

  const dummyUrl = 'http://api.dummy.com/recurso';

  const mockResponse: BaseResponseModel = {
    data: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DummyService]
    });

    service = TestBed.inject(DummyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar uma lista no getAll() desempacotando o "data"', () => {
    service.getAll().subscribe((dados) => {
      expect(dados.length).toBe(2);
      expect(dados).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(dummyUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve retornar um item pelo getById() desempacotando o "data"', () => {
    const singleResponse: BaseResponseModel = { data: { id: 1, name: 'Item 1' } };

    service.getById(1).subscribe((dado) => {
      expect(dado).toEqual(singleResponse.data);
    });

    const req = httpMock.expectOne(`${dummyUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(singleResponse);
  });

  it('deve buscar com parâmetros no getByFilters()', () => {
    const filter: DummyFilter = { name: 'Teste' };

    service.getByFilters(filter).subscribe((dados) => {
      expect(dados).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(request => request.url === `${dummyUrl}/pesquisar`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('name')).toBe('Teste');
    req.flush(mockResponse);
  });

  it('deve enviar um POST no create()', () => {
    const newItem: DummyModel = { name: 'Novo Item' };
    const createResponse: BaseResponseModel = { data: { id: 3, name: 'Novo Item' } };

    service.create(newItem).subscribe((dado) => {
      expect(dado).toEqual(createResponse.data);
    });

    const req = httpMock.expectOne(dummyUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);
    req.flush(createResponse);
  });

  it('deve enviar um PUT no update() passando o ID na URL', () => {
    const updateItem: DummyModel = { id: 1, name: 'Item Atualizado' };
    const updateResponse: BaseResponseModel = { data: updateItem };

    service.update(updateItem).subscribe((dado) => {
      expect(dado).toEqual(updateResponse.data);
    });

    const req = httpMock.expectOne(`${dummyUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateItem);
    req.flush(updateResponse);
  });

  describe('Método save()', () => {
    it('deve chamar create() se o item NÃO possuir id', () => {
      const newItem: DummyModel = { name: 'Sem ID' };
      const createResponse: BaseResponseModel = { data: { id: 4, name: 'Sem ID' } };

      service.save(newItem).subscribe(dado => {
        expect(dado).toEqual(createResponse.data);
      });

      const req = httpMock.expectOne(dummyUrl);
      expect(req.request.method).toBe('POST');
      req.flush(createResponse);
    });

    it('deve chamar update() se o item possuir id', () => {
      const existingItem: DummyModel = { id: 5, name: 'Com ID' };
      const updateResponse: BaseResponseModel = { data: existingItem };

      service.save(existingItem).subscribe(dado => {
        expect(dado).toEqual(updateResponse.data);
      });

      const req = httpMock.expectOne(`${dummyUrl}/5`);
      expect(req.request.method).toBe('PUT');
      req.flush(updateResponse);
    });
  });

  it('deve enviar um DELETE no delete()', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${dummyUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
