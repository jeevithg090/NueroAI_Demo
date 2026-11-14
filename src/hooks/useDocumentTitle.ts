import { useEffect } from 'react';

const APP_NAME = 'NeuroLearn AI';

/** Sets a per-page document title, e.g. "Teacher Portal · NeuroLearn AI". */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : `${APP_NAME} — Adaptive learning prototype`;
  }, [title]);
}
