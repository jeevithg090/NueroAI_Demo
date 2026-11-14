import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X } from 'lucide-react';

export const SWITCH_DELAY_MS = 1200;

const DIAGRAM_STEPS = ['👄 Mouth (Saliva)', '⏬ Oesophagus (Peristalsis)', '🫙 Stomach (Acids)'];

interface ModalitySwitchProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Overlay shown when a student says they are confused: it simulates switching
 * the explanation to a different modality (a step-by-step visual diagram).
 */
export function ModalitySwitch({ isOpen, onClose }: ModalitySwitchProps) {
  return <AnimatePresence>{isOpen && <ModalitySwitchPanel onClose={onClose} />}</AnimatePresence>;
}

/** Mounted fresh on every open, so the "thinking" state always restarts. */
function ModalitySwitchPanel({ onClose }: { onClose: () => void }) {
  const [thinking, setThinking] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setThinking(false), SWITCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 200 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modality-switch-title"
      className="fixed inset-0 bg-canvas/95 backdrop-blur-md z-50 flex flex-col items-center justify-center overflow-y-auto p-6"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 p-2 rounded-full bg-fg/10 hover:bg-fg/20 transition-colors"
      >
        <X size={24} aria-hidden="true" />
      </button>

      {thinking ? (
        <div className="flex flex-col items-center gap-6" role="status">
          <h2 id="modality-switch-title" className="sr-only">
            Switching modality
          </h2>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BrainCircuit size={64} className="text-adhd" aria-hidden="true" />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-mono text-xl"
          >
            Switching modality...
          </motion.p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          <h2 id="modality-switch-title" className="font-display text-3xl sm:text-4xl mb-4">
            No worries! Let's try this.
          </h2>
          <p className="text-muted text-lg mb-12">I've generated a visual diagram instead of text.</p>

          <div className="bg-card border border-line rounded-3xl p-8 flex flex-col items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
              <BrainCircuit size={120} />
            </div>

            <div className="flex flex-col items-center gap-4 z-10 w-full relative">
              {DIAGRAM_STEPS.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className="bg-raised px-6 py-4 rounded-xl w-full max-w-sm border border-line-strong font-bold text-lg"
                >
                  {step}
                </motion.div>
              ))}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-muted"
                aria-hidden="true"
              >
                ↓
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-raised px-6 py-4 rounded-xl w-full max-w-sm border border-line-strong font-bold text-lg"
              >
                🩸 Bloodstream (Energy)
              </motion.div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button type="button" onClick={onClose} className="btn btn-inverse btn-lg">
              Got it now!
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
