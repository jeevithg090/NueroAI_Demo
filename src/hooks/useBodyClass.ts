import { useEffect } from 'react';

/** Adds `className` to <body> while `active` is true and always removes it on unmount. */
export function useBodyClass(className: string, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, [className, active]);
}
