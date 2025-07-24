import { TestBed } from '@angular/core/testing';

import { Abstract } from './abstract';

describe('Abstract', () => {
  let service: Abstract;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Abstract);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
