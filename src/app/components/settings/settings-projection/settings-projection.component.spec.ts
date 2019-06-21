import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsProjectionComponent } from './settings-projection.component';

describe('SettingsProjectionComponent', () => {
  let component: SettingsProjectionComponent;
  let fixture: ComponentFixture<SettingsProjectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsProjectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
