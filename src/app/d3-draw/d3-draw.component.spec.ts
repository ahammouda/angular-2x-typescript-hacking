import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3DrawComponent } from './d3-draw.component';

describe('D3DrawComponent', () => {
  let component: D3DrawComponent;
  let fixture: ComponentFixture<D3DrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3DrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3DrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
