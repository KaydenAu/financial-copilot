import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfServicesPage } from './terms-of-services-page';

describe('TermsOfServicesPage', () => {
  let component: TermsOfServicesPage;
  let fixture: ComponentFixture<TermsOfServicesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsOfServicesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsOfServicesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
