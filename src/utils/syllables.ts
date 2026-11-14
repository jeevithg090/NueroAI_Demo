/**
 * Inserts a middle dot before each vowel group to give readers a visual cue
 * for where a word can be split, e.g. "digestion" -> "d·ig·est·ion".
 *
 * This is a lightweight visual heuristic, not a linguistic hyphenation algorithm.
 */
export function addSyllableDots(word: string): string {
  return word.replace(/([aeiou]+)/gi, '·$1').replace(/^·/, '');
}
