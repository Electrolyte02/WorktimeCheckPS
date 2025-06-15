import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTimeListComponent } from './my-time-list.component';

describe('MyTimeListComponent', () => {
  let component: MyTimeListComponent;
  let fixture: ComponentFixture<MyTimeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTimeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTimeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
