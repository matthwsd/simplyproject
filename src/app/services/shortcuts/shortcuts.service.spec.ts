import { TestBed } from '@angular/core/testing';

import { Shortcuts } from './shortcuts.service';

describe('ShortcutsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Shortcuts = TestBed.get(Shortcuts);
    expect(service).toBeTruthy();
  });
});
