import { TestBed } from '@angular/core/testing';

import { SettingsJSONService } from './settings-json.service';

describe('SettingsJSONService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsJSONService = TestBed.get(SettingsJSONService);
    expect(service).toBeTruthy();
  });
});
