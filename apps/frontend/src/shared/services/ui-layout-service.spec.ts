import { TestBed } from '@angular/core/testing';

import { UiLayoutService } from './ui-layout-service';

describe('UiLayoutService', () => {
  let service: UiLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
