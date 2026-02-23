import { TestBed } from '@angular/core/testing';

import { Fcart } from './fcart';

describe('Fcart', () => {
  let service: Fcart;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fcart);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
