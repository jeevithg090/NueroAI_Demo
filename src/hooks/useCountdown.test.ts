import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatClock, parseMinutes, useCountdown } from './useCountdown';

afterEach(() => vi.useRealTimers());

describe('parseMinutes', () => {
  it('parses minute labels into seconds', () => {
    expect(parseMinutes('18 min')).toBe(1080);
    expect(parseMinutes('2.5min')).toBe(150);
    expect(parseMinutes('soon')).toBe(0);
  });
});

describe('formatClock', () => {
  it('formats seconds as m:ss', () => {
    expect(formatClock(1112)).toBe('18:32');
    expect(formatClock(5)).toBe('0:05');
    expect(formatClock(-3)).toBe('0:00');
  });
});

describe('useCountdown', () => {
  it('counts down each second and stops at zero', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCountdown(3));
    expect(result.current).toBe(3);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(2);

    act(() => vi.advanceTimersByTime(5000));
    expect(result.current).toBe(0);
  });
});
