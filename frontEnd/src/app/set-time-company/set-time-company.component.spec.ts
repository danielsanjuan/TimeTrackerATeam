import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTimeCompanyComponent } from './set-time-company.component';

describe('SetTimeCompanyComponent', () => {
  let component: SetTimeCompanyComponent;
  let fixture: ComponentFixture<SetTimeCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetTimeCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetTimeCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
