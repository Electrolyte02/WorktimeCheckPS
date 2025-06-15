import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationListComponent } from './justification-list.component';

describe('JustificationListComponent', () => {
  let component: JustificationListComponent;
  let fixture: ComponentFixture<JustificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
