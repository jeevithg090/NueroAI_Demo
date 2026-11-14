import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface StatusScreenProps {
  title: string;
  children?: ReactNode;
  actionLabel?: string;
  actionTo?: string;
}

/** Full-page message used for empty, not-found and unavailable states. */
export function StatusScreen({
  title,
  children,
  actionLabel = 'Back to dashboard',
  actionTo = '/student',
}: StatusScreenProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="font-display mb-4 text-3xl font-bold">{title}</h1>
      {children && <div className="mb-8 max-w-md text-lg text-[#8B91C7]">{children}</div>}
      <Link
        to={actionTo}
        className="rounded-full bg-[#818CF8] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#6366f1]"
      >
        {actionLabel}
      </Link>
    </main>
  );
}
