import { describe, expect, it } from 'vitest';
import { addSyllableDots } from './syllables';

describe('addSyllableDots', () => {
  it('inserts a dot before each vowel group', () => {
    expect(addSyllableDots('digestion')).toBe('d·ig·est·ion');
    expect(addSyllableDots('stomach')).toBe('st·om·ach');
  });

  it('never starts a word with a dot', () => {
    expect(addSyllableDots('energy')).toBe('en·ergy');
    expect(addSyllableDots('Oesophagus').startsWith('·')).toBe(false);
  });

  it('leaves words without vowels unchanged', () => {
    expect(addSyllableDots('rhythm')).toBe('rhythm');
  });
});
