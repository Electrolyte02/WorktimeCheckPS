import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCheckListComponent } from './my-check-list.component';

describe('MyCheckListComponent', () => {
  let component: MyCheckListComponent;
  let fixture: ComponentFixture<MyCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCheckListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
