import { TestBed } from '@angular/core/testing';

import { AiPanelApi } from '../services/ai-panel-api';

describe('AiPanelApi', () => {
  let service: AiPanelApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiPanelApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
