import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { CheckCircle2, Loader2, ArrowRight, FileUp } from 'lucide-react';
import clsx from 'clsx';
import { adhdChunks, asdChunks, dyslexiaChunks } from '../data/chapters';
import { ACCEPT_ATTRIBUTE, validateCurriculumFile } from '../utils/upload';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { AppHeader } from '../components/layout/AppHeader';
import { LEARNING_MODES, type LearningMode } from '../types';

type PipelineState = 'idle' | 'processing' | 'done';

const PIPELINE_STEPS = [
  { label: 'Parsing PDF', duration: 800 },
  { label: 'Extracting concepts', duration: 1200 },
  { label: 'Generating ADHD mode', duration: 1500 },
  { label: 'Generating ASD mode', duration: 1500 },
  { label: 'Generating Dyslexia mode', duration: 1500 },
];

const SELECTS = [
  { id: 'subject', label: 'Subject', options: ['Science', 'Mathematics'] },
  { id: 'class', label: 'Class', options: ['Class 7', 'Class 8'] },
  { id: 'board', label: 'Board', options: ['NCERT', 'State Board'] },
];

/**
 * Simulates the curriculum transformation pipeline. Files are validated in the
 * browser but never uploaded anywhere; the output shown is bundled demo content.
 */
export default function TeacherPortal() {
  useDocumentTitle('Teacher Portal');
  const [pipelineState, setPipelineState] = useState<PipelineState>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState<LearningMode>('adhd');
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const startPipeline = (file: File) => {
    const result = validateCurriculumFile(file);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    clearTimers();
    setError(null);
    setFileName(file.name);
    setCurrentStep(0);
    setActiveTab('adhd');
    setPipelineState('processing');

    let delay = 0;
    PIPELINE_STEPS.forEach((step, idx) => {
      delay += step.duration;
      timers.current.push(
        setTimeout(() => {
          setCurrentStep(idx + 1);
          if (idx === PIPELINE_STEPS.length - 1) {
            timers.current.push(setTimeout(() => setPipelineState('done'), 500));
          }
        }, delay),
      );
    });
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) startPipeline(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startPipeline(file);
    e.target.value = '';
  };

  /** Arrow keys, Home and End move between output tabs (WAI-ARIA tabs pattern). */
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const index = LEARNING_MODES.indexOf(activeTab);
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (index + 1) % LEARNING_MODES.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + LEARNING_MODES.length) % LEARNING_MODES.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = LEARNING_MODES.length - 1;
    if (next === null) return;
    e.preventDefault();
    const mode = LEARNING_MODES[next];
    setActiveTab(mode);
    document.getElementById(`tab-${mode}`)?.focus();
  };

  const reset = () => {
    clearTimers();
    setPipelineState('idle');
    setCurrentStep(0);
    setFileName(null);
  };

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-canvas p-4 sm:p-6 pt-10 sm:pt-12 pb-28 max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">Teacher Portal</h1>
          <p className="text-muted text-lg sm:text-xl">
            Transform any curriculum into three adaptive formats instantly.
          </p>
        </header>

        {pipelineState === 'idle' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {SELECTS.map((select) => (
                <label key={select.id} className="flex-1">
                  <span className="mb-1.5 block text-sm font-medium text-muted">{select.label}</span>
                  <select className="field">
                    {select.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            <input
              ref={fileInputRef}
              id="curriculum-file"
              type="file"
              accept={ACCEPT_ATTRIBUTE}
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Curriculum file"
              aria-describedby="curriculum-file-hint"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={clsx(
                'w-full border-2 border-dashed hover:border-accent bg-card/50 rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group',
                isDragging ? 'border-accent' : 'border-line',
              )}
            >
              <span className="w-20 h-20 bg-accent-solid/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileUp size={40} className="text-accent" aria-hidden="true" />
              </span>
              <span className="text-xl sm:text-2xl font-bold mb-2">Drag your NCERT PDF here</span>
              <span className="text-muted mb-8">or click to browse files</span>
              <span id="curriculum-file-hint" className="flex gap-4 text-sm text-muted font-medium">
                <span>Supports: PDF, DOCX</span>
                <span aria-hidden="true">•</span>
                <span>Max size: 50MB</span>
              </span>
            </button>
            {error && (
              <p role="alert" className="mt-4 text-center text-danger font-medium">
                {error}
              </p>
            )}
            <p className="mt-6 text-center text-sm text-muted">
              Demo only: your file stays in the browser and the output below is sample content.
            </p>
          </div>
        )}

        {pipelineState === 'processing' && (
          <div
            className="max-w-xl mx-auto bg-card border border-line rounded-3xl p-6 sm:p-8 shadow-2xl"
            aria-live="polite"
          >
            <h2 className="font-display text-2xl font-bold mb-2 text-center">Transformation Pipeline</h2>
            {fileName && <p className="text-center text-sm text-muted font-mono mb-6 truncate">{fileName}</p>}
            <ol className="space-y-6 lg:px-8 pt-6 border-t border-line">
              {PIPELINE_STEPS.map((step, idx) => {
                const isDone = currentStep > idx;
                const isCurrent = currentStep === idx;
                const opacity = isDone ? 'opacity-100' : isCurrent ? 'opacity-100' : 'opacity-30';

                return (
                  <li
                    key={step.label}
                    className={`flex items-center justify-between ${opacity} transition-opacity duration-300`}
                  >
                    <span className="font-medium text-lg">
                      {idx + 1}. {step.label}
                    </span>
                    {isDone ? (
                      <CheckCircle2 size={24} className="text-dys" aria-label="Done" />
                    ) : isCurrent ? (
                      <Loader2 size={24} className="text-accent animate-spin" aria-label="In progress" />
                    ) : (
                      <span
                        className="w-6 h-6 rounded-full border-2 border-line-strong"
                        aria-label="Pending"
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {pipelineState === 'done' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-line pb-4">
              <div>
                <div className="flex items-center gap-2 text-dys font-bold mb-2" role="status">
                  <CheckCircle2 size={20} aria-hidden="true" /> Successfully generated 6 chunks
                </div>
                <h2 className="font-display text-3xl font-bold">Chapter 4: Digestive System</h2>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <button type="button" onClick={reset} className="btn btn-secondary">
                  Upload another
                </button>
                <button type="button" onClick={reset} className="btn btn-primary">
                  Assign to Class 7-A <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              className="grid grid-cols-3 gap-1 mb-6 p-1 bg-card rounded-xl w-full sm:w-fit sm:flex border border-line"
              role="tablist"
              aria-label="Generated outputs"
            >
              {LEARNING_MODES.map((mode) => (
                <button
                  type="button"
                  key={mode}
                  id={`tab-${mode}`}
                  role="tab"
                  aria-selected={activeTab === mode}
                  aria-controls="output-panel"
                  tabIndex={activeTab === mode ? 0 : -1}
                  onClick={() => setActiveTab(mode)}
                  onKeyDown={handleTabKeyDown}
                  className={`min-h-11 px-2 sm:px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-xs sm:text-sm leading-tight transition-colors ${activeTab === mode ? 'bg-raised text-fg' : 'text-muted hover:text-fg'}`}
                >
                  {mode} Output
                </button>
              ))}
            </div>

            <div
              id="output-panel"
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              className="bg-card border border-line rounded-3xl p-6 sm:p-8 min-h-[400px]"
            >
              {activeTab === 'adhd' && (
                <div className="max-w-2xl">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {adhdChunks[0].keyTerms.map((t) => (
                      <span key={t} className="bg-adhd-soft text-adhd text-xs font-bold px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold mb-6 text-adhd">
                    {adhdChunks[0].title}
                  </h3>
                  <p className="text-xl leading-relaxed text-fg mb-8">{adhdChunks[0].content}</p>
                  <div className="bg-canvas border border-line p-6 rounded-xl">
                    <p className="font-bold text-muted text-sm uppercase mb-3">Generated Quiz</p>
                    <p className="font-medium mb-3">{adhdChunks[0].quickCheck.question}</p>
                    <ul className="list-disc pl-5 text-muted space-y-1">
                      {adhdChunks[0].quickCheck.options.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === 'asd' && (
                <div className="max-w-2xl">
                  <div className="flex gap-2 mb-4">
                    <span className="bg-asd-soft text-asd text-xs font-bold px-2 py-1 rounded">
                      Literal Language
                    </span>
                    <span className="bg-asd-soft text-asd text-xs font-bold px-2 py-1 rounded">
                      No Metaphors
                    </span>
                  </div>
                  <h3 className="font-display text-3xl font-bold mb-6 text-asd">{asdChunks[0].title}</h3>
                  <p className="text-xl leading-relaxed text-fg mb-8">{asdChunks[0].content}</p>
                  <div className="bg-canvas border border-line p-6 rounded-xl">
                    <p className="font-bold text-muted text-sm uppercase mb-3">Generated Visual</p>
                    <p className="font-medium text-2xl">
                      {asdChunks[0].visual.emoji} {asdChunks[0].visual.label}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'dyslexia' && (
                <div className="max-w-2xl dyslexia-mode">
                  <h3 className="font-display text-3xl font-bold mb-6 text-dys">{dyslexiaChunks[0].title}</h3>
                  <p className="text-xl text-fg mb-8">{dyslexiaChunks[0].content}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
