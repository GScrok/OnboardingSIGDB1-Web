import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutes } from 'src/app/shared/app-routes.config';

import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleFormComponent } from './components/role-form/role-form.component';

const routes: Routes = [
  { path: '', component: RoleListComponent },
  { path: AppRoutes.PATHS.ROLE.NEW, component: RoleFormComponent },
  { path: AppRoutes.PATHS.ROLE.EDIT_ID, component: RoleFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
