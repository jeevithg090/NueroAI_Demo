import { describe, expect, it } from 'vitest';
import {
  generateProfile,
  loadProfile,
  PROFILE_STORAGE_KEY,
  recommendMode,
  saveProfile,
} from './profileUtils';
import { demoProfiles } from '../data/profiles';

describe('recommendMode', () => {
  it('defaults to the ASD engine when no answers are given', () => {
    expect(recommendMode({})).toBe('asd');
  });

  it('recommends ADHD for a short attention span with gamified motivation', () => {
    expect(recommendMode({ attention: 1, feedback: 'gamified' })).toBe('adhd');
    expect(recommendMode({ attention: 2, feedback: 'gamified' })).toBe('adhd');
  });

  it('does not recommend ADHD when attention span is long', () => {
    expect(recommendMode({ attention: 3, feedback: 'gamified' })).toBe('asd');
  });

  it('recommends dyslexia for audio learners, overriding the ADHD rule', () => {
    expect(recommendMode({ modality: 'audio' })).toBe('dyslexia');
    expect(recommendMode({ attention: 1, feedback: 'gamified', modality: 'audio' })).toBe('dyslexia');
  });

  it('recommends dyslexia for a minimal layout preference', () => {
    expect(recommendMode({ layout: 'minimal', sensory: 3 })).toBe('dyslexia');
  });

  it('returns to ASD for a minimal layout combined with a need for silence', () => {
    expect(recommendMode({ layout: 'minimal', sensory: 1 })).toBe('asd');
  });
});

describe('generateProfile', () => {
  it('builds a normalised vector from the answers', () => {
    const profile = generateProfile({ attention: 4, sensory: 2, modality: 'audio' });
    expect(profile.vector).toEqual([1, 0.5, 1]);
    expect(profile.recommendedMode).toBe('dyslexia');
  });

  it('fills in defaults for unanswered questions', () => {
    expect(generateProfile({})).toMatchObject({
      name: 'New Student',
      attentionSpan: 2,
      modalityPref: 'visual',
      sensoryScore: 2,
      layoutPref: 'structured',
      motivationType: 'predictable',
      vector: [0.5, 0.5, 0.3],
    });
  });
});

describe('profile storage', () => {
  it('round-trips a saved profile', () => {
    saveProfile(demoProfiles.adhd);
    expect(loadProfile()).toEqual(demoProfiles.adhd);
  });

  it('returns null when nothing is stored', () => {
    expect(loadProfile()).toBeNull();
  });

  it('returns null for corrupt JSON instead of throwing', () => {
    localStorage.setItem(PROFILE_STORAGE_KEY, '{not json');
    expect(loadProfile()).toBeNull();
  });

  it('rejects stored data with an unknown mode or malformed vector', () => {
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({ ...demoProfiles.asd, recommendedMode: 'other' }),
    );
    expect(loadProfile()).toBeNull();

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ ...demoProfiles.asd, vector: [1, 'x', 0] }));
    expect(loadProfile()).toBeNull();
  });
});
