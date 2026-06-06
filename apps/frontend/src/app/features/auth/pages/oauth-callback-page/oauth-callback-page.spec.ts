import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthCallbackPage } from './oauth-callback-page';

describe('OauthCallbackPage', () => {
  let component: OauthCallbackPage;
  let fixture: ComponentFixture<OauthCallbackPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthCallbackPage],
    }).compileComponents();

    fixture = TestBed.createComponent(OauthCallbackPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
