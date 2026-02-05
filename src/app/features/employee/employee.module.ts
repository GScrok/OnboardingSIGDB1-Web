import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { LinkCompanyComponent } from './components/link-company/link-company.component';
import { LinkRoleComponent } from './components/link-role/link-role.component';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { EmployeeRoleHistoryComponent } from './components/employee-role-history/employee-role-history.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeFormComponent,
    LinkCompanyComponent,
    LinkRoleComponent,
    EmployeeRoleHistoryComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
  ],
  providers: [provideNgxMask()],
})
export class EmployeeModule {}
