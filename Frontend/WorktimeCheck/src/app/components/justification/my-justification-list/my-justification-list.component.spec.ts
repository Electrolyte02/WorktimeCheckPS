import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJustificationListComponent } from './my-justification-list.component';

describe('MyJustificationListComponent', () => {
  let component: MyJustificationListComponent;
  let fixture: ComponentFixture<MyJustificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyJustificationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyJustificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
