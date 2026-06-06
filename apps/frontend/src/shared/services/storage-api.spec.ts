import { TestBed } from '@angular/core/testing';

import { StorageApi } from './storage-api';

describe('StorageApi', () => {
  let service: StorageApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
