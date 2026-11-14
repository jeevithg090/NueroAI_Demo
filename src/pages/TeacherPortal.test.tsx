import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderApp } from '../test/renderWithRouter';

afterEach(() => vi.useRealTimers());

const pdf = () => new File(['%PDF-1.4'], 'chapter-4.pdf', { type: 'application/pdf' });

describe('TeacherPortal', () => {
  it('rejects unsupported files with an error message', async () => {
    renderApp('/teacher');
    const input = await screen.findByLabelText(/curriculum file/i);
    // Drag-and-drop and some browsers bypass the accept filter, so validate in code too.
    fireEvent.change(input, { target: { files: [new File(['hi'], 'notes.txt', { type: 'text/plain' })] } });
    expect(screen.getByRole('alert')).toHaveTextContent(/pdf or docx/i);
  });

  it('runs the simulated pipeline and shows the outputs for each mode', async () => {
    const { user } = renderApp('/teacher');
    const input = await screen.findByLabelText(/curriculum file/i);
    vi.useFakeTimers({ shouldAdvanceTime: true });

    await user.upload(input, pdf());
    expect(screen.getByRole('heading', { name: /transformation pipeline/i })).toBeInTheDocument();
    expect(screen.getByText('chapter-4.pdf')).toBeInTheDocument();

    await act(async () => vi.advanceTimersByTime(7000));
    expect(screen.getByText(/successfully generated/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /asd output/i }));
    expect(screen.getByRole('tab', { name: /asd output/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/literal language/i)).toBeInTheDocument();
  });

  it('restarts the step counter when a second file is processed', async () => {
    const { user } = renderApp('/teacher');
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await user.upload(await screen.findByLabelText(/curriculum file/i), pdf());
    await act(async () => vi.advanceTimersByTime(7000));
    await user.click(screen.getByRole('button', { name: /upload another/i }));

    await user.upload(screen.getByLabelText(/curriculum file/i), pdf());
    expect(screen.getAllByLabelText('Pending')).toHaveLength(4);
    expect(screen.getByLabelText('In progress')).toBeInTheDocument();
  });
});
