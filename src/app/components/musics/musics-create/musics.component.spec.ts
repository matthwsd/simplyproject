import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicCreateComponent } from './musics.component';

describe('MusicsComponent', () => {
  let component: MusicCreateComponent;
  let fixture: ComponentFixture<MusicCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
