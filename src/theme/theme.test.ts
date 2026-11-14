import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyTheme,
  isThemePreference,
  loadThemePreference,
  resolveTheme,
  saveThemePreference,
  THEME_STORAGE_KEY,
} from './theme';

function mockSystemLight(isLight: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: isLight && query.includes('light'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('theme preference', () => {
  afterEach(() => {
    // @ts-expect-error -- jsdom has no matchMedia by default; remove the mock again.
    delete window.matchMedia;
  });

  it('recognises only valid preferences', () => {
    expect(isThemePreference('light')).toBe(true);
    expect(isThemePreference('system')).toBe(true);
    expect(isThemePreference('sepia')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });

  it('defaults to system and ignores corrupt stored values', () => {
    expect(loadThemePreference()).toBe('system');
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon');
    expect(loadThemePreference()).toBe('system');
  });

  it('saves explicit choices and clears the key for system', () => {
    saveThemePreference('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(loadThemePreference()).toBe('light');
    saveThemePreference('system');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('resolves system to the OS setting, and dark when it is unknown', () => {
    expect(resolveTheme('system')).toBe('dark');
    mockSystemLight(true);
    expect(resolveTheme('system')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('applies the theme to the root element', () => {
    applyTheme('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
