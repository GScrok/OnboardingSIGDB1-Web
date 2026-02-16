import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Role } from '../models/role.model';

import { BaseService } from 'src/app/core/base/base.service';
import { RoleFilter } from '../models/role.filter.model';

@Injectable()
export class RoleService extends BaseService<Role, RoleFilter> {
  constructor(protected override http: HttpClient) {
    super(http, `${environment.apiUrl}/cargos`);
  }
}
