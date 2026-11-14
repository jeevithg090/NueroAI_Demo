/**
 * Hidden on the landing page, during onboarding (to keep the quiz distraction-free) and inside
 * lessons, where it would cover the lesson controls.
 */
export function shouldShowRoleSwitcher(pathname: string): boolean {
  return pathname !== '/' && pathname !== '/onboarding' && !pathname.startsWith('/learn/');
}
