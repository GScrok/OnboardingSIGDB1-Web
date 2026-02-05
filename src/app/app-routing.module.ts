import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'company', loadChildren: () => import('./features/company/company.module').then(m => m.CompanyModule) },
  { path: 'employee', loadChildren: () => import('./features/employee/employee.module').then(m => m.EmployeeModule) },
  { path: 'role', loadChildren: () => import('./features/role/role.module').then(m => m.RoleModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
