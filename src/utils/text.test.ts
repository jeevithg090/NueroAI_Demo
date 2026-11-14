import { describe, expect, it } from 'vitest';
import { escapeRegExp, normalizeWord, splitByKeyTerms } from './text';

describe('splitByKeyTerms', () => {
  it('flags case-insensitive matches of key terms', () => {
    expect(splitByKeyTerms('Saliva has enzymes.', ['saliva', 'Enzymes'])).toEqual([
      { text: 'Saliva', isTerm: true },
      { text: ' has ', isTerm: false },
      { text: 'enzymes', isTerm: true },
      { text: '.', isTerm: false },
    ]);
  });

  it('returns the whole text as a single segment when there are no terms', () => {
    expect(splitByKeyTerms('Plain text', [])).toEqual([{ text: 'Plain text', isTerm: false }]);
    expect(splitByKeyTerms('', [])).toEqual([]);
  });

  it('treats regex characters in terms literally', () => {
    const segments = splitByKeyTerms('Is C++ (or C) hard?', ['C++', '(or C)']);
    expect(segments.filter((s) => s.isTerm).map((s) => s.text)).toEqual(['C++', '(or C)']);
  });

  it('prefers the longest overlapping term', () => {
    const segments = splitByKeyTerms('the bloodstream', ['blood', 'bloodstream']);
    expect(segments).toContainEqual({ text: 'bloodstream', isTerm: true });
  });
});

describe('escapeRegExp', () => {
  it('escapes special characters', () => {
    expect(new RegExp(escapeRegExp('a.b*c')).test('a.b*c')).toBe(true);
    expect(new RegExp(escapeRegExp('a.b')).test('axb')).toBe(false);
  });
});

describe('normalizeWord', () => {
  it('strips punctuation but keeps letters and digits', () => {
    expect(normalizeWord('energy.')).toBe('energy');
    expect(normalizeWord('(Saliva),')).toBe('Saliva');
    expect(normalizeWord('Class7!')).toBe('Class7');
  });
});
