import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIpComponent } from './user-ip.component';

describe('UserIpComponent', () => {
  let component: UserIpComponent;
  let fixture: ComponentFixture<UserIpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
