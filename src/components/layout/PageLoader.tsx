import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status">
      <Loader2 size={32} className="animate-spin text-accent" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
