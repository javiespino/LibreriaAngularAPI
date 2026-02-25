import { TestBed } from '@angular/core/testing';

import { Sorders } from './sorders';

describe('Sorders', () => {
  let service: Sorders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sorders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
