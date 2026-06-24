import { TestBed } from '@angular/core/testing';

import { SupportApi } from './support-api';

describe('SupportApi', () => {
  let service: SupportApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
