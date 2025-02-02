import { TestBed } from '@angular/core/testing';

import { SavedNewsService } from './saved-news.service';

describe('SavedNewsService', () => {
  let service: SavedNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
