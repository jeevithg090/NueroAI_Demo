import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dyslexiaChunks } from '../data/chapters';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { ModalitySwitch } from '../components/learning/ModalitySwitch';
import { isSpeechSupported, speakWithHighlight, VoiceAgent } from '../utils/tts';
import { addSyllableDots } from '../utils/syllables';
import { normalizeWord } from '../utils/text';
import { useBodyClass } from '../hooks/useBodyClass';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import clsx from 'clsx';
import type { Chapter } from '../types';

const FONT_SIZES = [
  { label: 'A-', value: 'text-lg', name: 'Smaller text', buttonClass: 'text-sm' },
  { label: 'A', value: 'text-xl', name: 'Default text size', buttonClass: 'text-base' },
  { label: 'A+', value: 'text-3xl', name: 'Larger text', buttonClass: 'text-xl' },
] as const;

type FontSize = (typeof FONT_SIZES)[number]['value'];

export default function LearnDyslexia({ chapter }: { chapter: Chapter }) {
  const navigate = useNavigate();

  const [chunkIndex, setChunkIndex] = useState(0);
  const [isConfused, setIsConfused] = useState(false);

  const [fontSize, setFontSize] = useState<FontSize>('text-xl');
  const [isDyslexicFont, setIsDyslexicFont] = useState(true);
  const [syllableMode, setSyllableMode] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [speechSupported] = useState(isSpeechSupported);

  const chunk = dyslexiaChunks[chunkIndex];
  const words = chunk.content.split(' ');
  const isLast = chunkIndex === dyslexiaChunks.length - 1;
  const stopAudioRef = useRef<(() => void) | null>(null);
  const closeConfused = useCallback(() => setIsConfused(false), []);

  useBodyClass('dyslexia-mode', isDyslexicFont);

  const stopAudio = useCallback(() => {
    stopAudioRef.current?.();
    stopAudioRef.current = null;
    setIsPlaying(false);
    setHighlightIndex(-1);
  }, []);

  // Stop any narration when leaving the page.
  useEffect(() => () => stopAudioRef.current?.(), []);

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }
    const stop = speakWithHighlight(
      chunk.content,
      (idx) => {
        setHighlightIndex(idx);
        if (idx === -1) {
          stopAudioRef.current = null;
          setIsPlaying(false);
        }
      },
      0.8,
    );
    if (stop) {
      stopAudioRef.current = stop;
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    stopAudio();
    if (!isLast) {
      setChunkIndex((prev) => prev + 1);
    } else {
      navigate('/student');
    }
  };

  const speakTerm = (term: string) => {
    if (!isPlaying) new VoiceAgent('dyslexia').speak(`${term}. This is a key term.`);
  };

  const renderWord = (word: string, i: number) => {
    const displayWord = syllableMode ? addSyllableDots(word) : word;
    const cleanWord = normalizeWord(word);
    const isTerm = chunk.keyTerms.some((t) => t.toLowerCase() === cleanWord.toLowerCase());
    const className = clsx(
      'transition-colors duration-150 inline-block mr-[0.2em] mb-[0.2em] rounded px-1 -ml-1',
      highlightIndex === i
        ? 'bg-dys-solid text-dys-ink'
        : isTerm && 'bg-dys-soft border-b-2 border-dys text-dys',
    );

    if (isTerm && speechSupported) {
      return (
        <button
          type="button"
          key={i}
          className={clsx(className, 'cursor-pointer')}
          onClick={() => speakTerm(cleanWord)}
          aria-label={`${cleanWord}, key term. Hear it spoken.`}
        >
          {displayWord}
        </button>
      );
    }
    return (
      <span key={i} className={className}>
        {displayWord}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-dys-soft border-b border-dys-line flex items-center justify-between px-4 sm:px-6 z-40">
        <div className="flex items-center gap-1 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/student')}
            aria-label="Back to dashboard"
            className="icon-btn -ml-2"
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
          <span className="font-bold text-dys text-lg">
            <span className="sm:hidden">
              {chunkIndex + 1}/{dyslexiaChunks.length}
            </span>
            <span className="hidden sm:inline">
              Part {chunkIndex + 1} of {dyslexiaChunks.length}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-4">
          <div
            className="flex items-center gap-1 sm:gap-2 bg-dys-deep p-1.5 rounded-lg border border-dys-line"
            role="group"
            aria-label="Text size"
          >
            {FONT_SIZES.map((size) => (
              <button
                type="button"
                key={size.value}
                onClick={() => setFontSize(size.value)}
                aria-label={size.name}
                aria-pressed={fontSize === size.value}
                className={clsx(
                  'px-2 sm:px-3 py-1 hover:bg-dys-solid/20 rounded font-bold text-dys',
                  size.buttonClass,
                  fontSize === size.value && 'bg-dys-solid/20',
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsDyslexicFont((prev) => !prev)}
            aria-pressed={isDyslexicFont}
            className={clsx(
              'px-2 sm:px-4 py-2 rounded font-bold border transition-colors border-dys-line',
              isDyslexicFont ? 'bg-dys-solid text-dys-ink' : 'bg-dys-deep text-dys',
            )}
          >
            <span className="sm:hidden" aria-hidden="true">
              Aa
            </span>
            <span className="sr-only sm:not-sr-only">OpenDyslexic</span>
          </button>
          <ThemeToggle className="text-dys" />
        </div>
      </header>

      <main className="pt-28 sm:pt-32 pb-40 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* Voice Agent UI */}
        <div className="w-full bg-card border border-line rounded-3xl p-6 mb-12 flex flex-col sm:flex-row items-center gap-6 shadow-lg">
          <div
            className="w-20 h-20 bg-dys-soft border-2 border-dys rounded-full flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span className="text-3xl">🎧</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-sans font-bold text-lg mb-1">
              Sam{' '}
              <span className="text-muted text-sm font-normal">
                {!speechSupported
                  ? 'needs a browser with speech support'
                  : isPlaying
                    ? 'is reading…'
                    : 'is ready to read'}
              </span>
            </h2>
            <div className="flex justify-center sm:justify-start items-center gap-1 h-6" aria-hidden="true">
              {/* Fake waveform */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-dys-solid rounded-full"
                  style={{
                    height: isPlaying ? '100%' : '20%',
                    transition: 'height 0.2s',
                    animation: isPlaying ? `waveform 1s infinite ${i * 0.1}s` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayToggle}
              disabled={!speechSupported}
              className="bg-dys-solid text-dys-ink p-4 rounded-full hover:scale-105 transition-transform flex items-center gap-2 font-bold font-sans disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <>
                  <Pause size={20} aria-hidden="true" /> Stop
                </>
              ) : (
                <>
                  <Play size={20} aria-hidden="true" /> Play Text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-3xl">
          <p className="text-sm font-sans text-muted mb-2">{chapter.title}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-fg border-b border-line pb-6">
            {chunk.title}
          </h1>

          <p className={clsx('text-fg', fontSize)}>{words.map(renderWord)}</p>
        </div>

        <div className="mt-16 bg-dys-deep border border-dys-line p-6 rounded-2xl w-full max-w-3xl flex justify-between items-center gap-4">
          <span id="syllable-label" className="font-sans font-medium text-dys">
            Break words into syllables?
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={syllableMode}
            aria-labelledby="syllable-label"
            onClick={() => setSyllableMode((prev) => !prev)}
            className={clsx(
              'px-6 py-2 rounded-full font-bold transition-colors font-sans',
              syllableMode ? 'bg-dys-solid text-dys-ink' : 'bg-dys-soft text-dys border-2 border-dys',
            )}
          >
            {syllableMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-dys-soft border-t border-dys-line flex justify-between items-center gap-3 z-30 font-sans">
        <button
          type="button"
          onClick={() => setIsConfused(true)}
          className="text-dys hover:bg-dys-solid/10 px-4 sm:px-6 py-3 rounded-full font-bold transition-colors"
        >
          <span aria-hidden="true">😕</span> I&apos;m confused
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="bg-dys-solid text-dys-ink px-6 sm:px-8 py-3 rounded-full font-extrabold text-lg flex items-center gap-2 hover:scale-105 transition-transform"
        >
          {isLast ? 'Finish →' : 'Got it! Next →'}
        </button>
      </div>

      <ModalitySwitch isOpen={isConfused} onClose={closeConfused} />
    </div>
  );
}
