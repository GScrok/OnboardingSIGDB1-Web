import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role.model';

import { map } from 'rxjs/operators';
import { RoleFilter } from '../models/role.filter.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiPath = `${environment.apiUrl}/cargos`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Role[]> {
    return this.http
      .get<any>(this.apiPath)
      .pipe(map((response) => response.data));
  }

  getById(id: number): Observable<Role> {
    return this.http
    .get<any>(`${this.apiPath}/${id}`)
    .pipe(map((response) => response.data));
  }

  getByFilters(filter: RoleFilter): Observable<Role[]> {
    const options = { 
        params: filter as any
      };
    
    return this.http
    .get<any>(`${this.apiPath}/pesquisar`, options)
    .pipe(map((response) => response.data));
  }

  create(role: Role): Observable<Role> {
    return this.http
    .post<any>(this.apiPath, role)
    .pipe(map((response) => response.data));
  }

  update(role: Role): Observable<Role> {
    return this.http
    .put<any>(`${this.apiPath}/${role.id}`, role)
    .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }
}