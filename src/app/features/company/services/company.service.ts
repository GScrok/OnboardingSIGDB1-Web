import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Company } from '../models/company.model';
import { CompanyFilter } from '../models/company.filter.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiPath = `${environment.apiUrl}/empresas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Company[]> {
    return this.http
      .get<any>(this.apiPath)
      .pipe(map((response) => response.data));
  }

  getById(id: number): Observable<Company> {
    return this.http
      .get<any>(`${this.apiPath}/${id}`)
      .pipe(map((response) => response.data));
  }

  getByFilters(filter: CompanyFilter): Observable<Company[]> {
    const options = { 
        params: filter as any
      };

    return this.http
      .get<any>(`${this.apiPath}/pesquisar`, options)
      .pipe(map((response) => response.data));
  }

  create(company: Company): Observable<Company> {
    return this.http
      .post<any>(this.apiPath, company)
      .pipe(map((response) => response.data));
  }

  update(company: Company): Observable<Company> {
    return this.http
      .put<any>(`${this.apiPath}/${company.id}`, company)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }
}
