import { TestBed } from '@angular/core/testing';

import { CoreLayoutApi } from './core-layout-api';

describe('CoreLayoutApi', () => {
  let service: CoreLayoutApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreLayoutApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
