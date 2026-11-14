/** Hidden on the landing page and inside lessons, where it would cover the lesson controls. */
export function shouldShowRoleSwitcher(pathname: string): boolean {
  return pathname !== '/' && !pathname.startsWith('/learn/');
}
