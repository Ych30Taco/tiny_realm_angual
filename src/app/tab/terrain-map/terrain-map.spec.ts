import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrainMap } from './terrain-map';

describe('TerrainMap', () => {
  let component: TerrainMap;
  let fixture: ComponentFixture<TerrainMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerrainMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerrainMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
