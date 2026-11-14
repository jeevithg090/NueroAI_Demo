import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Starts every new page at the top instead of keeping the previous page's scroll position. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
