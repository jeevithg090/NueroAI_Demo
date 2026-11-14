import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status">
      <Loader2 size={32} className="animate-spin text-[#818CF8]" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
