import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getWordOffsets, msPerWord, pickVoice, speakWithHighlight, VoiceAgent, wordIndexAtChar } from './tts';

class FakeUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  voice: SpeechSynthesisVoice | null = null;
  onboundary: ((event: { name: string; charIndex: number }) => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

const voice = (name: string) => ({ name }) as SpeechSynthesisVoice;

let spoken: FakeUtterance[];
let synth: {
  speak: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  getVoices: () => SpeechSynthesisVoice[];
};

beforeEach(() => {
  spoken = [];
  synth = {
    speak: vi.fn((u: FakeUtterance) => spoken.push(u)),
    cancel: vi.fn(),
    getVoices: () => [voice('Some Voice'), voice('Google US English')],
  };
  vi.stubGlobal('speechSynthesis', synth);
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('word offsets', () => {
  it('computes the start index of each word', () => {
    expect(getWordOffsets('The mouth chews')).toEqual([0, 4, 10]);
  });

  it('maps character positions to word indexes', () => {
    const offsets = getWordOffsets('The mouth chews');
    expect(wordIndexAtChar(offsets, 0)).toBe(0);
    expect(wordIndexAtChar(offsets, 5)).toBe(1);
    expect(wordIndexAtChar(offsets, 10)).toBe(2);
    expect(wordIndexAtChar(offsets, 99)).toBe(2);
  });
});

describe('msPerWord', () => {
  it('gets shorter as the speech rate increases', () => {
    expect(msPerWord(1)).toBeCloseTo(461.5, 0);
    expect(msPerWord(2)).toBeLessThan(msPerWord(1));
  });
});

describe('pickVoice', () => {
  it('prefers the exact configured voice, then any Google voice, then the first', () => {
    const voices = [voice('A'), voice('Google UK English Female'), voice('Google US English')];
    expect(pickVoice(voices, 'Google US English')?.name).toBe('Google US English');
    expect(pickVoice(voices, 'Missing')?.name).toBe('Google UK English Female');
    expect(pickVoice([voice('A')], 'Missing')?.name).toBe('A');
    expect(pickVoice([], 'Missing')).toBeUndefined();
  });
});

describe('speakWithHighlight', () => {
  it('returns null when speech synthesis is unavailable', () => {
    vi.unstubAllGlobals();
    vi.stubGlobal('speechSynthesis', undefined);
    // jsdom does not implement speechSynthesis at all.
    Reflect.deleteProperty(window, 'speechSynthesis');
    expect(speakWithHighlight('hello', vi.fn())).toBeNull();
  });

  it('follows word boundary events from the speech engine', () => {
    const onWord = vi.fn();
    speakWithHighlight('The mouth chews', onWord);
    const utterance = spoken[0];

    utterance.onboundary?.({ name: 'word', charIndex: 4 });
    utterance.onboundary?.({ name: 'sentence', charIndex: 0 });
    utterance.onend?.();

    expect(onWord.mock.calls).toEqual([[1], [-1]]);
  });

  it('falls back to timed highlighting when no boundary events arrive', () => {
    vi.useFakeTimers();
    const onWord = vi.fn();
    speakWithHighlight('one two', onWord, 1);

    vi.advanceTimersByTime(msPerWord(1) * 3);
    expect(onWord.mock.calls).toEqual([[0], [1], [-1]]);
  });

  it('stops playback and timers when the returned function is called', () => {
    vi.useFakeTimers();
    const onWord = vi.fn();
    const stop = speakWithHighlight('one two three', onWord, 1);
    stop?.();
    vi.advanceTimersByTime(10_000);
    expect(onWord).not.toHaveBeenCalled();
    expect(synth.cancel).toHaveBeenCalled();
  });
});

describe('VoiceAgent', () => {
  it('speaks with the voice settings for its mode', () => {
    new VoiceAgent('dyslexia').speak('Saliva');
    expect(spoken[0]).toMatchObject({ text: 'Saliva', rate: 0.8, pitch: 1.1 });
    expect(spoken[0].voice?.name).toBe('Google US English');
  });
});
