import { TestBed } from '@angular/core/testing';

import { Iorder } from './iorder';

describe('Iorder', () => {
  let service: Iorder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Iorder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
