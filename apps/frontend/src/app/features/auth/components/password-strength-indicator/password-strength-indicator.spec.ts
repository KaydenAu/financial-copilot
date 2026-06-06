import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrengthIndicator } from './password-strength-indicator';

describe('PasswordStrengthIndicator', () => {
  let component: PasswordStrengthIndicator;
  let fixture: ComponentFixture<PasswordStrengthIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthIndicator],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthIndicator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
