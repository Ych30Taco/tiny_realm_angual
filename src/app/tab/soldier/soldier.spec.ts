import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Soldier } from './soldier';

describe('Soldier', () => {
  let component: Soldier;
  let fixture: ComponentFixture<Soldier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Soldier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Soldier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
