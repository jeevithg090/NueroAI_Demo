/** The three adaptive presentation engines the prototype demonstrates. */
export type LearningMode = 'adhd' | 'asd' | 'dyslexia';

export const LEARNING_MODES: readonly LearningMode[] = ['adhd', 'asd', 'dyslexia'];

export const MODE_LABELS: Record<LearningMode, string> = {
  adhd: 'ADHD',
  asd: 'ASD',
  dyslexia: 'Dyslexia',
};

export function isLearningMode(value: unknown): value is LearningMode {
  return typeof value === 'string' && (LEARNING_MODES as readonly string[]).includes(value);
}

export type Modality = 'text' | 'audio' | 'visual' | 'kinesthetic';
export type LayoutPreference = 'minimal' | 'structured' | 'rich' | 'none';
export type MotivationType = 'gamified' | 'predictable' | 'audio' | 'autonomous';

/** Raw answers collected during onboarding, keyed by question id. */
export interface OnboardingAnswers {
  attention?: number;
  modality?: Modality;
  sensory?: number;
  layout?: LayoutPreference;
  feedback?: MotivationType;
}

export interface StudentProfile {
  name: string;
  age?: number;
  attentionSpan: number;
  modalityPref: Modality;
  sensoryScore: number;
  layoutPref?: LayoutPreference;
  motivationType?: MotivationType;
  recommendedMode: LearningMode;
  /** Normalised [attention, sensory, audio-preference] vector, each in 0..1. */
  vector: [number, number, number];
}

export interface Chapter {
  id: string;
  title: string;
  subject: string;
  class: string;
  board: string;
  estimatedTime: Record<LearningMode, string>;
  progress: number;
  chunks: number;
  /** Whether adapted lesson content ships with the demo for this chapter. */
  hasDemoContent: boolean;
}

export interface AdhdChunk {
  id: number;
  title: string;
  content: string;
  keyTerms: string[];
  visual: string;
  quickCheck: {
    question: string;
    options: string[];
    correct: number;
  };
  xpReward: number;
  estimatedMinutes: number;
}

export interface AsdChunk {
  id: number;
  title: string;
  content: string;
  visual: { type: 'icon'; emoji: string; label: string };
  nextPreview: string;
  confirmQuestion: string;
  correct: number;
  options: string[];
}

export interface DyslexiaChunk {
  id: number;
  title: string;
  content: string;
  keyTerms: string[];
}
