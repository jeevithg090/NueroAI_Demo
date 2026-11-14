import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';

/** Slim top bar shared by the dashboard, teacher, admin and status pages. */
export function AppHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="-ml-2 flex min-h-11 items-center gap-2 rounded-full px-2"
          aria-label="NeuroLearn AI home"
        >
          <BrainCircuit className="text-accent" size={26} aria-hidden="true" />
          <span className="font-display text-lg font-semibold tracking-tight whitespace-nowrap">
            NeuroLearn AI
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
