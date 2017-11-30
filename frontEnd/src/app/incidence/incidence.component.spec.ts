import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenceComponent } from './incidence.component';

describe('IncidenceComponent', () => {
  let component: IncidenceComponent;
  let fixture: ComponentFixture<IncidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
