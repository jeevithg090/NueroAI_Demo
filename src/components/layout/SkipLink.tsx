import type { MouseEvent } from 'react';

/** First focusable element on every page: jumps keyboard users past the header to the page's <main>. */
export function SkipLink() {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;
    event.preventDefault();
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    main.focus();
    main.scrollIntoView({ block: 'start' });
  };

  return (
    <a
      href="#main"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-accent-solid focus:px-5 focus:py-3 focus:font-semibold focus:text-white focus:shadow-card"
    >
      Skip to main content
    </a>
  );
}
