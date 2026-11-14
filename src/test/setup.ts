import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// jsdom does not implement scrolling; ScrollToTop calls it on every route change.
window.scrollTo = (() => {}) as typeof window.scrollTo;
