import type { OnboardingAnswers } from '../types';

export interface OnboardingOption {
  label: string;
  value: string | number;
}

export interface OnboardingQuestion {
  id: keyof OnboardingAnswers;
  question: string;
  icon: string;
  options: OnboardingOption[];
}

export const questions: OnboardingQuestion[] = [
  {
    id: 'attention',
    question: "When you're studying, how long can you focus before needing a break?",
    icon: '⏱️',
    options: [
      { label: 'Less than 5 minutes', value: 1 },
      { label: '5–10 minutes', value: 2 },
      { label: '10–20 minutes', value: 3 },
      { label: '20+ minutes', value: 4 },
    ],
  },
  {
    id: 'modality',
    question: 'When you learn something new, what helps most?',
    icon: '🧠',
    options: [
      { label: 'Reading text', value: 'text' },
      { label: 'Listening to someone explain', value: 'audio' },
      { label: 'Seeing a diagram or picture', value: 'visual' },
      { label: 'Doing it hands-on / interacting', value: 'kinesthetic' },
    ],
  },
  {
    id: 'sensory',
    question: 'How do you feel about background sounds or music while studying?',
    icon: '🎵',
    options: [
      { label: 'I need total silence', value: 1 },
      { label: 'Soft music helps me focus', value: 2 },
      { label: "I don't mind either way", value: 3 },
      { label: 'I love ambient or lo-fi sounds', value: 4 },
    ],
  },
  {
    id: 'layout',
    question: 'Which type of page feels easiest to read?',
    icon: '📄',
    options: [
      { label: 'Simple — one thing at a time', value: 'minimal' },
      { label: 'Structured — clear sections', value: 'structured' },
      { label: 'Rich — lots of info visible', value: 'rich' },
      { label: 'No preference', value: 'none' },
    ],
  },
  {
    id: 'feedback',
    question: 'What keeps you motivated when studying?',
    icon: '🏆',
    options: [
      { label: 'Progress bars & rewards', value: 'gamified' },
      { label: 'Knowing exactly what comes next', value: 'predictable' },
      { label: 'Hearing it explained', value: 'audio' },
      { label: 'Working at my own pace', value: 'autonomous' },
    ],
  },
];
