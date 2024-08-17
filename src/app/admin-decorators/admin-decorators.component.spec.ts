import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDecoratorsComponent } from './admin-decorators.component';

describe('AdminDecoratorsComponent', () => {
  let component: AdminDecoratorsComponent;
  let fixture: ComponentFixture<AdminDecoratorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDecoratorsComponent]
    });
    fixture = TestBed.createComponent(AdminDecoratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
