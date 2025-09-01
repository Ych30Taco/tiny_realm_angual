import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAdmin } from './data-admin';

describe('DataAdmin', () => {
  let component: DataAdmin;
  let fixture: ComponentFixture<DataAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
