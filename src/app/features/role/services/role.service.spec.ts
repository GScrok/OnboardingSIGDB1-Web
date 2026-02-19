import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoleService],
    });

    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve repassar a URL correta (/roles) para o BaseService', () => {
    service.getAll().subscribe();

    const expectedUrl = `${environment.apiUrl}/cargos`;

    const req = httpMock.expectOne(expectedUrl);

    expect(req.request.method).toBe('GET');

    req.flush({ data: [], success: true, message: 'Sucesso' });
  });
});
