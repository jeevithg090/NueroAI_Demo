import { isLearningMode, type LearningMode, type OnboardingAnswers, type StudentProfile } from '../types';

export const PROFILE_STORAGE_KEY = 'neurolearn_profile';

const DEFAULT_ANSWERS = {
  attention: 2,
  modality: 'visual',
  sensory: 2,
  layout: 'structured',
  feedback: 'predictable',
} as const satisfies Required<OnboardingAnswers>;

/**
 * Picks the adaptive engine for a set of onboarding answers.
 *
 * Rules are applied in order, so later rules take precedence:
 *  1. Default to the calm, predictable ASD engine.
 *  2. Short attention span + gamified motivation -> ADHD engine.
 *  3. Audio learners or a preference for minimal layouts -> dyslexia (audio-first) engine.
 *  4. Minimal layout combined with a need for total silence -> back to the ASD engine.
 */
export function recommendMode(answers: OnboardingAnswers): LearningMode {
  const attention = answers.attention ?? DEFAULT_ANSWERS.attention;
  const modality = answers.modality ?? DEFAULT_ANSWERS.modality;
  const sensory = answers.sensory ?? DEFAULT_ANSWERS.sensory;
  const layout = answers.layout ?? DEFAULT_ANSWERS.layout;
  const feedback = answers.feedback ?? DEFAULT_ANSWERS.feedback;

  let mode: LearningMode = 'asd';
  if (attention <= 2 && feedback === 'gamified') mode = 'adhd';
  if (modality === 'audio' || layout === 'minimal') mode = 'dyslexia';
  if (layout === 'minimal' && sensory === 1) mode = 'asd';
  return mode;
}

export function generateProfile(answers: OnboardingAnswers): StudentProfile {
  const attentionSpan = answers.attention ?? DEFAULT_ANSWERS.attention;
  const modalityPref = answers.modality ?? DEFAULT_ANSWERS.modality;
  const sensoryScore = answers.sensory ?? DEFAULT_ANSWERS.sensory;
  const layoutPref = answers.layout ?? DEFAULT_ANSWERS.layout;
  const motivationType = answers.feedback ?? DEFAULT_ANSWERS.feedback;

  return {
    name: 'New Student',
    attentionSpan,
    modalityPref,
    sensoryScore,
    layoutPref,
    motivationType,
    recommendedMode: recommendMode(answers),
    vector: [attentionSpan / 4, sensoryScore / 4, modalityPref === 'audio' ? 1 : 0.3],
  };
}

function getStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    // Accessing localStorage throws in some privacy modes.
    return null;
  }
}

export function saveProfile(profile: StudentProfile): void {
  try {
    getStorage()?.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage may be full or disabled; the demo still works for this page view.
  }
}

function isValidProfile(value: unknown): value is StudentProfile {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<StudentProfile>;
  return (
    isLearningMode(candidate.recommendedMode) &&
    Array.isArray(candidate.vector) &&
    candidate.vector.length === 3 &&
    candidate.vector.every((n) => typeof n === 'number' && Number.isFinite(n))
  );
}

/** Returns the stored profile, or `null` if none exists or the stored data is invalid. */
export function loadProfile(): StudentProfile | null {
  let raw: string | null = null;
  try {
    raw = getStorage()?.getItem(PROFILE_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isValidProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
