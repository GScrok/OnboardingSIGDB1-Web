import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { LinkCompanyComponent } from './components/link-company/link-company.component';
import { LinkRoleComponent } from './components/link-role/link-role.component';
import { EmployeeRoleHistoryComponent } from './components/employee-role-history/employee-role-history.component';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'new', component: EmployeeFormComponent },
  { path: 'edit/:id', component: EmployeeFormComponent },
  { path: 'link-company/:id', component: LinkCompanyComponent },
  { path: 'link-role/:id', component: LinkRoleComponent },
  { path: 'role-history/:id', component: EmployeeRoleHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
