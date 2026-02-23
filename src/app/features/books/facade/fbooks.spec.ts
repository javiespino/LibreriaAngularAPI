import { TestBed } from '@angular/core/testing';

import { Fbooks } from './fbooks';

describe('Fbooks', () => {
  let service: Fbooks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fbooks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
