import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';

const routes: Routes = [
  { path: '', component: CompanyListComponent },
  { path: 'new', component: CompanyFormComponent },
  { path: 'edit/:id', component: CompanyFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
