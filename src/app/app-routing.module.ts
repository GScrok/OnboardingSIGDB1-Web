import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutes } from './shared/app-routes.config';

const routes: Routes = [
  { path: '', redirectTo: AppRoutes.PATHS.EMPLOYEE.ROOT, pathMatch: 'full' },
  { path: AppRoutes.PATHS.COMPANY.ROOT, loadChildren: () => import('./features/company/company.module').then(m => m.CompanyModule) },
  { path: AppRoutes.PATHS.EMPLOYEE.ROOT, loadChildren: () => import('./features/employee/employee.module').then(m => m.EmployeeModule) },
  { path: AppRoutes.PATHS.ROLE.ROOT, loadChildren: () => import('./features/role/role.module').then(m => m.RoleModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
