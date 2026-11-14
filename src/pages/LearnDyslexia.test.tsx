import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../test/renderWithRouter';

describe('LearnDyslexia', () => {
  it('applies the OpenDyslexic body class and removes it when toggled off', async () => {
    const { user, unmount } = renderApp('/learn/dyslexia/ch4-digestive');
    await screen.findByRole('heading', { level: 1, name: /what is digestion/i });
    expect(document.body).toHaveClass('dyslexia-mode');

    await user.click(screen.getByRole('button', { name: /opendyslexic/i }));
    expect(document.body).not.toHaveClass('dyslexia-mode');

    await user.click(screen.getByRole('button', { name: /opendyslexic/i }));
    unmount();
    expect(document.body).not.toHaveClass('dyslexia-mode');
  });

  it('disables narration when the browser has no speech synthesis', async () => {
    renderApp('/learn/dyslexia/ch4-digestive');
    expect(await screen.findByRole('button', { name: /play text/i })).toBeDisabled();
    expect(screen.getByText(/needs a browser with speech support/i)).toBeInTheDocument();
  });

  it('splits words into syllables when the switch is turned on', async () => {
    const { user } = renderApp('/learn/dyslexia/ch4-digestive');
    const toggle = await screen.findByRole('switch', { name: /syllables/i });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('pr·oc·ess')).toBeInTheDocument();
  });

  it('changes the text size', async () => {
    const { user } = renderApp('/learn/dyslexia/ch4-digestive');
    const larger = await screen.findByRole('button', { name: /larger text/i });
    await user.click(larger);
    expect(larger).toHaveAttribute('aria-pressed', 'true');
  });
});
