import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from './test/renderWithRouter';
import { saveProfile } from './utils/profileUtils';
import { demoProfiles } from './data/profiles';

describe('routing', () => {
  it('renders the landing page without the role switcher', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: /one platform/i })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: /switch demo role/i })).not.toBeInTheDocument();
    expect(document.title).toMatch(/NeuroLearn AI/);
  });

  it('starts a demo profile from an engine card', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: /demo the dyslexia engine/i }));
    expect(await screen.findByText(/dyslexia mode/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /hi, rahul/i })).toBeInTheDocument();
  });

  it('redirects to onboarding when no profile exists', async () => {
    renderApp('/student');
    expect(await screen.findByText(/how long can you focus/i)).toBeInTheDocument();
  });

  it('shows a not-found state for unknown lessons and modes', async () => {
    renderApp('/learn/adhd/does-not-exist');
    expect(await screen.findByRole('heading', { name: /lesson not found/i })).toBeInTheDocument();
  });

  it('rejects an unknown learning mode', async () => {
    renderApp('/learn/visual/ch4-digestive');
    expect(await screen.findByRole('heading', { name: /lesson not found/i })).toBeInTheDocument();
  });

  it('explains when a chapter has no demo content yet', async () => {
    renderApp('/learn/asd/ch6-fractions');
    expect(await screen.findByRole('heading', { name: /fractions and decimals/i })).toBeInTheDocument();
    expect(screen.getByText(/isn.t included in the demo yet/i)).toBeInTheDocument();
  });

  it('hides the role switcher inside lessons so it does not cover lesson controls', async () => {
    renderApp('/learn/asd/ch4-digestive');
    expect(await screen.findByRole('button', { name: /i understand/i })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: /switch demo role/i })).not.toBeInTheDocument();
  });

  it('shows the role switcher on dashboards with the active role marked', async () => {
    saveProfile(demoProfiles.asd);
    renderApp('/student');
    const nav = await screen.findByRole('navigation', { name: /switch demo role/i });
    await waitFor(() => expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent('Student'));
  });

  it('renders a 404 page for unknown routes', () => {
    renderApp('/nowhere');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
