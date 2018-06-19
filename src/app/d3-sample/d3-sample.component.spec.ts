import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3SampleComponent } from './d3-sample.component';

describe('D3SampleComponent', () => {
  let component: D3SampleComponent;
  let fixture: ComponentFixture<D3SampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
