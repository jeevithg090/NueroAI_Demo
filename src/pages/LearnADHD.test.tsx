import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderApp } from '../test/renderWithRouter';
import { adhdChunks } from '../data/chapters';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const first = adhdChunks[0];

describe('LearnADHD', () => {
  it('awards XP and builds a streak for a correct quick-check answer', async () => {
    const { user } = renderApp('/learn/adhd/ch4-digestive');
    expect(await screen.findByRole('heading', { level: 1, name: first.title })).toBeInTheDocument();
    expect(screen.getByText(/240 XP/)).toBeInTheDocument();
    expect(screen.getByText(/0 Streak/)).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: first.quickCheck.options[first.quickCheck.correct] }),
    );

    expect(screen.getByText(`⭐ ${240 + first.xpReward} XP`)).toBeInTheDocument();
    expect(screen.getByText(/1 Streak/)).toBeInTheDocument();
  });

  it('locks the answers after one choice and resets the streak on a wrong answer', async () => {
    const { user } = renderApp('/learn/adhd/ch4-digestive');
    const wrong = first.quickCheck.options.find((_, i) => i !== first.quickCheck.correct)!;
    await user.click(await screen.findByRole('button', { name: wrong }));

    expect(screen.getByText(/240 XP/)).toBeInTheDocument();
    expect(screen.getByText(/0 Streak/)).toBeInTheDocument();
    for (const option of first.quickCheck.options) {
      expect(screen.getByRole('button', { name: option })).toBeDisabled();
    }
  });

  it('highlights key terms in the lesson text', async () => {
    renderApp('/learn/adhd/ch4-digestive');
    const paragraph = (await screen.findByText(/when you eat a pizza/i)).closest('p')!;
    const highlighted = within(paragraph)
      .getAllByText((_, el) => el?.tagName === 'STRONG')
      .map((el) => el.textContent);
    expect(highlighted).toEqual(['blood', 'DIGESTION', 'factory']);
  });

  it('moves to the next chunk after answering', async () => {
    const { user } = renderApp('/learn/adhd/ch4-digestive');
    await user.click(await screen.findByRole('button', { name: first.quickCheck.options[0] }));
    await user.click(screen.getByRole('button', { name: /got it! next/i }));
    expect(await screen.findByRole('heading', { level: 1, name: adhdChunks[1].title })).toBeInTheDocument();
  });

  it('opens and closes the modality switch overlay', async () => {
    const { user } = renderApp('/learn/adhd/ch4-digestive');
    await user.click(await screen.findByRole('button', { name: /i'm confused/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
