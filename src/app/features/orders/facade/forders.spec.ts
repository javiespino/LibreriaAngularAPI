import { TestBed } from '@angular/core/testing';

import { Forders } from './forders';

describe('Forders', () => {
  let service: Forders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Forders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
