import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalIncidenceComponent } from './personal-incidence.component';

describe('PersonalIncidenceComponent', () => {
  let component: PersonalIncidenceComponent;
  let fixture: ComponentFixture<PersonalIncidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalIncidenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalIncidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
