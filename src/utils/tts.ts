import type { LearningMode } from '../types';

export function isSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  );
}

/** Returns the start offset of every space-separated word in `text`. */
export function getWordOffsets(text: string): number[] {
  const offsets: number[] = [];
  let position = 0;
  for (const word of text.split(' ')) {
    offsets.push(position);
    position += word.length + 1;
  }
  return offsets;
}

/** Maps a character index reported by the speech engine to the index of the word containing it. */
export function wordIndexAtChar(offsets: readonly number[], charIndex: number): number {
  let index = 0;
  for (let i = 0; i < offsets.length; i++) {
    if (offsets[i] <= charIndex) index = i;
    else break;
  }
  return index;
}

/** Estimated milliseconds per word at a given speech rate (~130 words per minute at rate 1). */
export function msPerWord(rate: number): number {
  return 60000 / (130 * rate);
}

/**
 * Reads `text` aloud and reports the index of the word currently being spoken.
 *
 * Uses the engine's word-boundary events when available and falls back to a
 * timing estimate otherwise. `onWordChange(-1)` is called once reading ends.
 * Returns a function that stops playback, or `null` if speech is unsupported.
 */
export function speakWithHighlight(
  text: string,
  onWordChange: (index: number) => void,
  rate = 0.9,
): (() => void) | null {
  if (!isSpeechSupported()) return null;

  const synth = window.speechSynthesis;
  const words = text.split(' ');
  const offsets = getWordOffsets(text);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.1;

  let finished = false;
  let usingBoundaryEvents = false;
  let fallbackIndex = 0;

  const finish = () => {
    if (finished) return;
    finished = true;
    clearInterval(fallbackTimer);
    onWordChange(-1);
  };

  const fallbackTimer = setInterval(() => {
    if (usingBoundaryEvents) return;
    if (fallbackIndex < words.length) {
      onWordChange(fallbackIndex);
      fallbackIndex++;
    } else {
      finish();
    }
  }, msPerWord(rate));

  utterance.onboundary = (event) => {
    if (event.name !== 'word') return;
    usingBoundaryEvents = true;
    onWordChange(wordIndexAtChar(offsets, event.charIndex));
  };
  utterance.onend = finish;
  utterance.onerror = finish;

  synth.cancel();
  synth.speak(utterance);

  return () => {
    finished = true;
    clearInterval(fallbackTimer);
    synth.cancel();
  };
}

interface VoiceConfig {
  rate: number;
  pitch: number;
  voiceName: string;
}

const VOICE_CONFIGS: Record<LearningMode, VoiceConfig> = {
  adhd: { rate: 1.2, pitch: 1.3, voiceName: 'Google UK English Male' },
  asd: { rate: 0.85, pitch: 1.0, voiceName: 'Google UK English Female' },
  dyslexia: { rate: 0.8, pitch: 1.1, voiceName: 'Google US English' },
};

export function getVoiceConfig(mode: LearningMode): VoiceConfig {
  return VOICE_CONFIGS[mode];
}

/** Chooses the configured voice if installed, then any Google voice, then the first available. */
export function pickVoice(
  voices: readonly SpeechSynthesisVoice[],
  preferredName: string,
): SpeechSynthesisVoice | undefined {
  return (
    voices.find((voice) => voice.name === preferredName) ??
    voices.find((voice) => voice.name.includes('Google')) ??
    voices[0]
  );
}

/** Speaks short prompts with a voice profile tuned to each learning mode. */
export class VoiceAgent {
  constructor(private readonly mode: LearningMode) {}

  speak(text: string): SpeechSynthesisUtterance | null {
    if (!isSpeechSupported()) return null;

    const config = getVoiceConfig(this.mode);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;

    const voice = pickVoice(window.speechSynthesis.getVoices(), config.voiceName);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  stop(): void {
    if (isSpeechSupported()) window.speechSynthesis.cancel();
  }
}
