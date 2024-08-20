import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerRequestsComponent } from './worker-requests.component';

describe('WorkerRequestsComponent', () => {
  let component: WorkerRequestsComponent;
  let fixture: ComponentFixture<WorkerRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkerRequestsComponent]
    });
    fixture = TestBed.createComponent(WorkerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
