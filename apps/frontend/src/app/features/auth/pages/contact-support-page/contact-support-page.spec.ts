import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSupportPage } from './contact-support-page';

describe('ContactSupportPage', () => {
  let component: ContactSupportPage;
  let fixture: ComponentFixture<ContactSupportPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSupportPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSupportPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
