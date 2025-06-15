import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckFormComponent } from './check-form.component';

describe('CheckFormComponent', () => {
  let component: CheckFormComponent;
  let fixture: ComponentFixture<CheckFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
