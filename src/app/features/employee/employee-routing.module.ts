import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { LinkCompanyComponent } from './components/link-company/link-company.component';
import { LinkRoleComponent } from './components/link-role/link-role.component';
import { EmployeeRoleHistoryComponent } from './components/employee-role-history/employee-role-history.component';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: AppRoutes.PATHS.EMPLOYEE.NEW, component: EmployeeFormComponent },
  { path: AppRoutes.PATHS.EMPLOYEE.EDIT_ID, component: EmployeeFormComponent },
  { path: AppRoutes.PATHS.EMPLOYEE.LINK_COMPANY_ID, component: LinkCompanyComponent },
  { path: AppRoutes.PATHS.EMPLOYEE.LINK_ROLE_ID, component: LinkRoleComponent },
  { path: AppRoutes.PATHS.EMPLOYEE.ROLE_HISTORY_ID, component: EmployeeRoleHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
