import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { questions, type OnboardingOption } from '../data/onboardingQuestions';
import { generateProfile, saveProfile } from '../utils/profileUtils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { OnboardingAnswers, StudentProfile } from '../types';

/** Pause after a selection so the student sees their choice highlighted. */
export const ADVANCE_DELAY_MS = 400;
/** How long the "analysing" screen is shown before opening the dashboard. */
export const ANALYSIS_DURATION_MS = 3000;

export default function Onboarding() {
  useDocumentTitle('Onboarding');
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [vector, setVector] = useState<[number, number, number]>([0, 0, 0]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const advancing = useRef(false);
  // Tracks the visible question so clicks on a question that is animating out are ignored.
  const activeQuestion = useRef(0);

  const schedule = (fn: () => void, delay: number) => {
    timers.current.push(setTimeout(fn, delay));
  };

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const startAnalysis = (finalAnswers: OnboardingAnswers) => {
    const generated = generateProfile(finalAnswers);
    saveProfile(generated);
    setProfile(generated);

    // Reveal the profile vector one dimension at a time.
    const [a, b, c] = generated.vector;
    schedule(() => setVector([a, 0, 0]), 300);
    schedule(() => setVector([a, b, 0]), 600);
    schedule(() => setVector([a, b, c]), 900);
    schedule(() => navigate('/student'), ANALYSIS_DURATION_MS);
  };

  const goToQuestion = (index: number) => {
    activeQuestion.current = index;
    setCurrentQ(index);
  };

  const handleSelect = (questionIndex: number, option: OnboardingOption) => {
    if (advancing.current || questionIndex !== activeQuestion.current) return;
    advancing.current = true;

    const questionId = questions[questionIndex].id;
    const newAnswers = { ...answers, [questionId]: option.value } as OnboardingAnswers;
    setAnswers(newAnswers);

    schedule(() => {
      advancing.current = false;
      if (questionIndex < questions.length - 1) {
        goToQuestion(questionIndex + 1);
      } else {
        startAnalysis(newAnswers);
      }
    }, ADVANCE_DELAY_MS);
  };

  const handleBack = () => {
    if (advancing.current) return;
    if (currentQ === 0) navigate('/');
    else goToQuestion(currentQ - 1);
  };

  if (profile) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div role="status">
            <h1 className="font-display text-3xl mb-8">Analysing your profile...</h1>
          </div>
          <div className="flex gap-4 items-end justify-center mb-8 h-32" aria-hidden="true">
            {vector.map((value, i) => (
              <motion.div
                key={i}
                className="w-16 bg-[#818CF8] rounded-t-lg"
                initial={{ height: 0 }}
                animate={{ height: value * 120 + 10 }}
                transition={{ type: 'spring', damping: 20 }}
              />
            ))}
          </div>
          <p className="text-[#8B91C7] font-mono">[ {vector.map((v) => v.toFixed(2)).join(', ')} ]</p>
        </motion.div>
      </main>
    );
  }

  const q = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col relative overflow-hidden">
      <div
        className="h-1 bg-[#2A2D45] w-full fixed top-0"
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={currentQ}
      >
        <motion.div
          className="h-full bg-[#818CF8]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-6 pt-6 max-w-4xl mx-auto w-full">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-[#8B91C7] hover:text-white rounded-full px-3 py-2 -ml-3"
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back
        </button>
        <span className="text-sm font-mono text-[#8B91C7]">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <div className="text-center mb-10 sm:mb-12">
              <span className="text-4xl block mb-4" aria-hidden="true">
                {q.icon}
              </span>
              <h1
                id={`question-${q.id}`}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight"
              >
                {q.question}
              </h1>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              role="group"
              aria-labelledby={`question-${q.id}`}
            >
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.label}
                    onClick={() => handleSelect(currentQ, opt)}
                    aria-pressed={isSelected}
                    className={`p-5 sm:p-6 md:p-8 rounded-2xl border text-left text-lg font-medium transition-all ${
                      isSelected
                        ? 'border-[#818CF8] bg-[#818CF8]/10'
                        : 'border-[#2A2D45] bg-[#1C1F35] hover:border-[#8B91C7]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
