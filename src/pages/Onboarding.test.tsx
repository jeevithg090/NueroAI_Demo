import { act, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderApp } from '../test/renderWithRouter';
import { loadProfile } from '../utils/profileUtils';
import { ADVANCE_DELAY_MS, ANALYSIS_DURATION_MS } from './Onboarding';

afterEach(() => vi.useRealTimers());

const answers = [
  /less than 5 minutes/i,
  /doing it hands-on/i,
  /ambient or lo-fi/i,
  /structured/i,
  /progress bars & rewards/i,
];

describe('Onboarding', () => {
  it('builds a profile from the answers and opens the student dashboard', async () => {
    renderApp('/onboarding');
    await screen.findByText(/how long can you focus/i);
    vi.useFakeTimers({ shouldAdvanceTime: true });

    for (const [index, answer] of answers.entries()) {
      expect(screen.getByText(`${index + 1} / ${answers.length}`)).toBeInTheDocument();
      // Wait until the question has finished animating in before answering it.
      const option = await screen.findByRole('button', { name: answer });
      act(() => option.click());
      await act(async () => vi.advanceTimersByTime(ADVANCE_DELAY_MS + 600));
    }

    expect(screen.getByRole('heading', { name: /analysing your profile/i })).toBeInTheDocument();
    expect(loadProfile()).toMatchObject({ recommendedMode: 'adhd', attentionSpan: 1, sensoryScore: 4 });

    await act(async () => vi.advanceTimersByTime(ANALYSIS_DURATION_MS));
    expect(await screen.findByText(/adhd mode/i)).toBeInTheDocument();
  });

  it('ignores repeated clicks while advancing, so no question is skipped', async () => {
    renderApp('/onboarding');
    const option = await screen.findByRole('button', { name: answers[0] });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    act(() => {
      option.click();
      option.click();
      option.click();
    });
    await act(async () => vi.advanceTimersByTime(ADVANCE_DELAY_MS + 600));
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
  });

  it('goes back to the previous question', async () => {
    const { user } = renderApp('/onboarding');
    await user.click(await screen.findByRole('button', { name: answers[0] }));
    await screen.findByText('2 / 5');
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(await screen.findByText('1 / 5')).toBeInTheDocument();
  });
});
