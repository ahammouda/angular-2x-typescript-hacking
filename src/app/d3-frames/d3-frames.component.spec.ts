import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3FramesComponent } from './d3-frames.component';

describe('D3FramesComponent', () => {
  let component: D3FramesComponent;
  let fixture: ComponentFixture<D3FramesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3FramesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3FramesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
