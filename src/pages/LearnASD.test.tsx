import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../test/renderWithRouter';
import { asdChunks } from '../data/chapters';

describe('LearnASD', () => {
  it('only allows moving on after the confirmation question is answered', async () => {
    const { user } = renderApp('/learn/asd/ch4-digestive');
    const next = await screen.findByRole('button', { name: /i understand\. next/i });
    expect(next).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'True' }));
    expect(next).toBeEnabled();

    await user.click(next);
    expect(await screen.findByRole('heading', { level: 1, name: asdChunks[1].title })).toBeInTheDocument();
  });

  it('toggles quiet mode', async () => {
    const { user } = renderApp('/learn/asd/ch4-digestive');
    const quiet = await screen.findByRole('button', { name: /quiet mode/i });
    expect(quiet).toHaveAttribute('aria-pressed', 'false');
    await user.click(quiet);
    expect(quiet).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText(/nila is here to help/i)).not.toBeInTheDocument();
  });
});
