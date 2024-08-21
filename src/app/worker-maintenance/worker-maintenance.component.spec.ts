import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerMaintenanceComponent } from './worker-maintenance.component';

describe('WorkerMaintenanceComponent', () => {
  let component: WorkerMaintenanceComponent;
  let fixture: ComponentFixture<WorkerMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkerMaintenanceComponent]
    });
    fixture = TestBed.createComponent(WorkerMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
