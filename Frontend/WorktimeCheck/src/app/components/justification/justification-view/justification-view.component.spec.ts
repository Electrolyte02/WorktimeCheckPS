import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationViewComponent } from './justification-view.component';

describe('JustificationViewComponent', () => {
  let component: JustificationViewComponent;
  let fixture: ComponentFixture<JustificationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificationViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
