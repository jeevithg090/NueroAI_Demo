/** Escapes characters that have special meaning in a regular expression. */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface TextSegment {
  text: string;
  isTerm: boolean;
}

/**
 * Splits `content` into segments, flagging each case-insensitive match of a key term.
 * Longer terms are matched first so that overlapping terms resolve predictably.
 */
export function splitByKeyTerms(content: string, keyTerms: readonly string[]): TextSegment[] {
  const terms = keyTerms.filter((term) => term.trim().length > 0);
  if (terms.length === 0) return content ? [{ text: content, isTerm: false }] : [];

  const pattern = [...terms]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|');
  const lowerTerms = new Set(terms.map((term) => term.toLowerCase()));

  return content
    .split(new RegExp(`(${pattern})`, 'gi'))
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, isTerm: lowerTerms.has(part.toLowerCase()) }));
}

/** Strips punctuation from a word so it can be compared against a key term. */
export function normalizeWord(word: string): string {
  return word.replace(/[^\p{L}\p{N}]/gu, '');
}
