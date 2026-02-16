import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { BaseService } from 'src/app/core/base/base.service';
import { Company } from '../models/company.model';
import { CompanyFilter } from '../models/company.filter.model';

@Injectable()
export class CompanyService extends BaseService<Company, CompanyFilter> {

  constructor(protected override http: HttpClient) {
    super(http, `${environment.apiUrl}/empresas`);
  }
}
