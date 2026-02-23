import { TestBed } from '@angular/core/testing';

import { Sbooks } from './sbooks';

describe('Sbooks', () => {
  let service: Sbooks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sbooks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
