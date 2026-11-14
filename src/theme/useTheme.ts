import { useCallback, useEffect, useState } from 'react';
import {
  applyTheme,
  loadThemePreference,
  resolveTheme,
  saveThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

/**
 * Tracks the light/dark preference. "system" follows the operating system and
 * updates live when it changes.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(loadThemePreference);
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(preference));

  useEffect(() => {
    const update = () => {
      const next = resolveTheme(preference);
      setResolved(next);
      applyTheme(next);
    };
    update();
    if (preference !== 'system' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-color-scheme: light)');
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, [preference]);

  const toggle = useCallback(() => {
    const next: ThemePreference = resolveTheme(preference) === 'dark' ? 'light' : 'dark';
    saveThemePreference(next);
    setPreference(next);
  }, [preference]);

  return { preference, resolved, toggle };
}
