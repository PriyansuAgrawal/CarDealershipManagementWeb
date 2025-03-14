import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanDetailComponent } from './salesman-detail.component';

describe('SalesmanDetailComponent', () => {
  let component: SalesmanDetailComponent;
  let fixture: ComponentFixture<SalesmanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesmanDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesmanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
