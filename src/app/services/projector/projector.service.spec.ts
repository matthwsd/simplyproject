import { TestBed } from '@angular/core/testing';

import { ProjectorService } from './projector.service';

describe('ProjectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectorService = TestBed.get(ProjectorService);
    expect(service).toBeTruthy();
  });
});
