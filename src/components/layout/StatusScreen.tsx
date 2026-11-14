import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AppHeader } from './AppHeader';

interface StatusScreenProps {
  title: string;
  children?: ReactNode;
  actionLabel?: string;
  actionTo?: string;
  /** Optional icon shown above the title. */
  icon?: LucideIcon;
  /** Small label above the title, e.g. "404". */
  eyebrow?: string;
}

/** Full-page message used for empty, not-found and unavailable states. */
export function StatusScreen({
  title,
  children,
  actionLabel = 'Back to dashboard',
  actionTo = '/student',
  icon: Icon,
  eyebrow,
}: StatusScreenProps) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        {Icon && (
          <span className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-line bg-card text-accent">
            <Icon size={30} aria-hidden="true" />
          </span>
        )}
        {eyebrow && <p className="eyebrow mb-3 font-mono text-accent">{eyebrow}</p>}
        <h1 className="font-display mb-4 text-3xl font-bold text-balance sm:text-4xl">{title}</h1>
        {children && <div className="mb-8 max-w-md text-lg text-pretty text-muted">{children}</div>}
        <Link to={actionTo} className="btn btn-primary btn-lg">
          {actionLabel}
        </Link>
      </main>
    </>
  );
}
