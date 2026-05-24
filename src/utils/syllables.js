export function addSyllableDots(word) {
  return word.replace(/([aeiou]+)/gi, '·$1').replace(/^·/, '');
}
