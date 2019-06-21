import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicsSelectComponent } from './musics-select.component';

describe('MusicsSelectComponent', () => {
  let component: MusicsSelectComponent;
  let fixture: ComponentFixture<MusicsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicsSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
