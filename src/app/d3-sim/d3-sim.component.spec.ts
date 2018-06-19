import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3SimComponent } from './d3-sim.component';

describe('D3SimComponent', () => {
  let component: D3SimComponent;
  let fixture: ComponentFixture<D3SimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
