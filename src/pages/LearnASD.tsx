import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { asdChunks } from '../data/chapters';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { ModalitySwitch } from '../components/learning/ModalitySwitch';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import type { Chapter } from '../types';

export default function LearnASD({ chapter }: { chapter: Chapter }) {
  const navigate = useNavigate();

  const [chunkIndex, setChunkIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfused, setIsConfused] = useState(false);
  /** Quiet mode hides the companion and schedule panels to reduce visual input. */
  const [isQuiet, setIsQuiet] = useState(false);

  const chunk = asdChunks[chunkIndex];
  const isLast = chunkIndex === asdChunks.length - 1;
  const closeConfused = useCallback(() => setIsConfused(false), []);

  const handleNext = () => {
    setSelectedOption(null);
    if (chunkIndex < asdChunks.length - 1) {
      setChunkIndex((prev) => prev + 1);
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top Bar - Never moves */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-line flex items-center justify-between px-4 sm:px-6 z-40 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/student')}
            aria-label="Back to dashboard"
            className="icon-btn -ml-2"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <span className="font-medium text-fg truncate">
            <span className="hidden md:inline">{chapter.title} · </span>Section {chunkIndex + 1} of{' '}
            {asdChunks.length}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {!isQuiet && (
            <div className="hidden sm:flex items-center bg-asd-soft border border-asd-line px-3 py-1.5 rounded-md text-asd text-sm">
              <span className="mr-2" aria-hidden="true">
                🔵
              </span>{' '}
              Nila is here to help
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsQuiet((prev) => !prev)}
            aria-pressed={isQuiet}
            className={`min-h-10 px-3 py-1.5 text-sm rounded ${isQuiet ? 'bg-asd-soft text-asd' : 'text-muted hover:text-fg'}`}
          >
            <span aria-hidden="true">🔇</span> Quiet mode
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Progress Bar - Simple */}
      <div
        className="fixed top-16 left-0 right-0 h-2 bg-card z-40"
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuemin={0}
        aria-valuemax={asdChunks.length}
        aria-valuenow={chunkIndex}
      >
        <div className="h-full bg-asd-solid" style={{ width: `${(chunkIndex / asdChunks.length) * 100}%` }} />
      </div>

      <div className="pt-24 pb-32 px-4 sm:px-6 max-w-7xl mx-auto flex gap-10 h-full">
        {/* Left Agent (always visible, no layout shift) */}
        <aside
          className={`w-64 hidden ${isQuiet ? '' : 'lg:flex'} flex-col shrink-0`}
          aria-label="Learning companion"
        >
          <div className="bg-surface p-6 border border-line rounded-xl flex flex-col items-center text-center sticky top-24">
            <div
              className="w-24 h-24 bg-gradient-to-b from-asd-line to-asd-soft rounded-full mb-6 border-4 border-asd flex items-center justify-center text-4xl"
              aria-hidden="true"
            >
              🔵
            </div>
            <h2 className="font-bold text-lg mb-2">Nila</h2>
            <p className="text-asd text-sm font-medium mb-4">
              Right now we are learning about:
              <br />
              {chunk.title.toLowerCase()}
            </p>
            <div className="w-full h-px bg-raised mb-4" />
            <p className="text-muted text-sm">{chunk.nextPreview}</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-3xl">
          <div className="bg-card border border-line rounded-xl p-6 sm:p-8 lg:p-12 mb-8">
            <h1 className="font-display text-3xl font-semibold mb-8 text-fg">{chunk.title}</h1>
            <p className="text-xl leading-relaxed text-fg">{chunk.content}</p>

            {/* Simple visual */}
            <div className="mt-10 bg-surface p-6 rounded-lg border border-line flex items-center gap-6">
              <span className="text-5xl" aria-hidden="true">
                {chunk.visual.emoji}
              </span>
              <span className="text-muted font-medium">{chunk.visual.label}</span>
            </div>
          </div>

          {/* Check */}
          <div className="bg-surface border border-line rounded-xl p-6 sm:p-8">
            <h2 className="text-lg font-medium mb-6">{chunk.confirmQuestion}</h2>
            <div className="grid gap-3">
              {chunk.options.map((opt, i) => {
                const isCorrect = i === chunk.correct;
                const isSelected = selectedOption === i;
                let style = 'bg-card border-line';
                if (selectedOption !== null) {
                  if (isCorrect) style = 'bg-asd-soft border-asd text-asd';
                  else if (isSelected) style = 'bg-danger-soft border-danger text-danger';
                  else style = 'opacity-50 pointer-events-none bg-card border-line';
                }

                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => {
                      if (selectedOption === null) setSelectedOption(i);
                    }}
                    disabled={selectedOption !== null}
                    className={`p-4 rounded-lg text-left font-medium border-2 transition-none ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Visual Schedule */}
        <aside className={`w-72 hidden ${isQuiet ? '' : 'xl:block'} shrink-0`} aria-label="Lesson schedule">
          <div className="bg-surface p-6 border border-line rounded-xl sticky top-24">
            <h2 className="font-bold text-muted mb-6 uppercase text-sm tracking-wider">Schedule</h2>
            <ul className="space-y-4">
              {asdChunks.map((c, i) => {
                let status = 'upcoming';
                if (i < chunkIndex) status = 'done';
                if (i === chunkIndex) status = 'current';

                return (
                  <li
                    key={c.id}
                    className="flex items-start gap-3"
                    aria-current={status === 'current' ? 'step' : undefined}
                  >
                    {status === 'done' && (
                      <CheckCircle2 size={20} className="text-dys mt-0.5 shrink-0" aria-label="Done" />
                    )}
                    {status === 'current' && (
                      <span className="text-asd font-bold shrink-0 w-5" aria-hidden="true">
                        →
                      </span>
                    )}
                    {status === 'upcoming' && (
                      <Circle size={20} className="text-muted mt-0.5 shrink-0" aria-hidden="true" />
                    )}

                    <span
                      className={`font-medium ${status === 'current' ? 'text-asd' : status === 'done' ? 'text-muted' : 'text-muted'}`}
                    >
                      {c.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-line p-4 flex justify-between sm:justify-end items-center px-4 sm:px-12 z-40 gap-4">
        <button
          type="button"
          onClick={() => setIsConfused(true)}
          className="text-muted hover:text-fg px-3 sm:px-6 py-2 rounded font-medium"
        >
          😕 I don't understand
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={selectedOption === null}
          className={`px-5 sm:px-8 py-3 rounded font-bold transition-none ${selectedOption !== null ? 'bg-asd-solid text-asd-ink hover:brightness-110' : 'bg-raised text-muted cursor-not-allowed'}`}
        >
          {isLast ? 'I understand. Finish →' : 'I understand. Next →'}
        </button>
      </div>

      <ModalitySwitch isOpen={isConfused} onClose={closeConfused} />
    </div>
  );
}
