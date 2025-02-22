import { TestBed } from '@angular/core/testing';

import { JellyfinService } from './jellyfin.service';

describe('JellyfinService', () => {
  let service: JellyfinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JellyfinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
