import { describe, expect, it } from 'vitest';
import { shouldShowRoleSwitcher } from './navigation';

describe('shouldShowRoleSwitcher', () => {
  it('shows the switcher on the role pages', () => {
    expect(shouldShowRoleSwitcher('/student')).toBe(true);
    expect(shouldShowRoleSwitcher('/teacher')).toBe(true);
    expect(shouldShowRoleSwitcher('/admin')).toBe(true);
  });

  it('hides it on the landing page, during onboarding and inside lessons', () => {
    expect(shouldShowRoleSwitcher('/')).toBe(false);
    expect(shouldShowRoleSwitcher('/onboarding')).toBe(false);
    expect(shouldShowRoleSwitcher('/learn/adhd/ch4-digestive')).toBe(false);
  });
});
