import type { LearningMode, StudentProfile } from '../types';

export const demoProfiles: Record<LearningMode, StudentProfile> = {
  adhd: {
    name: 'Arjun',
    age: 11,
    attentionSpan: 1,
    modalityPref: 'kinesthetic',
    sensoryScore: 4,
    recommendedMode: 'adhd',
    vector: [0.25, 1.0, 0.3],
  },
  asd: {
    name: 'Priya',
    age: 9,
    attentionSpan: 3,
    modalityPref: 'visual',
    sensoryScore: 1,
    recommendedMode: 'asd',
    vector: [0.75, 0.25, 0.3],
  },
  dyslexia: {
    name: 'Rahul',
    age: 13,
    attentionSpan: 3,
    modalityPref: 'audio',
    sensoryScore: 3,
    recommendedMode: 'dyslexia',
    vector: [0.75, 0.75, 1.0],
  },
};
