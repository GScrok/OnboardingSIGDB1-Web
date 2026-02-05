import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRoleHistoryComponent } from './employee-role-history.component';

describe('EmployeeRoleHistoryComponent', () => {
  let component: EmployeeRoleHistoryComponent;
  let fixture: ComponentFixture<EmployeeRoleHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeRoleHistoryComponent]
    });
    fixture = TestBed.createComponent(EmployeeRoleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
