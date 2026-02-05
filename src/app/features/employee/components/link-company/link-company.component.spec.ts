import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCompanyComponent } from './link-company.component';

describe('LinkCompanyComponent', () => {
  let component: LinkCompanyComponent;
  let fixture: ComponentFixture<LinkCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkCompanyComponent]
    });
    fixture = TestBed.createComponent(LinkCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
