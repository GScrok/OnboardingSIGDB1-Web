import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';

const routes: Routes = [
  { path: '', component: CompanyListComponent },
  { path: AppRoutes.PATHS.COMPANY.NEW, component: CompanyFormComponent },
  { path: AppRoutes.PATHS.COMPANY.EDIT_ID, component: CompanyFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
