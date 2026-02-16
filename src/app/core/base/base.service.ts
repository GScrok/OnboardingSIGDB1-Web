import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Base } from './base.model';
import { BaseFilter } from './base.filter.model';

export abstract class BaseService<T extends Base, F extends BaseFilter> {
  protected constructor(
    protected http: HttpClient,
    protected apiUrl: string,
  ) {}

  getAll(): Observable<T[]> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getById(id: number): Observable<T> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  getByFilters(filter: F): Observable<T[]> {
    const options = {
      params: filter as any,
    };

    return this.http
      .get<any>(`${this.apiUrl}/pesquisar`, options)
      .pipe(map((response) => response.data));
  }

  create(item: T): Observable<T> {
    return this.http
      .post<any>(this.apiUrl, item)
      .pipe(map((response) => response.data));
  }

  update(company: T): Observable<T> {
    return this.http
      .put<any>(`${this.apiUrl}/${company.id}`, company)
      .pipe(map((response) => response.data));
  }

  save(item: T): Observable<T> {
    if (item.id) {
      return this.update(item);
    } else {
      return this.create(item);
    }
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
