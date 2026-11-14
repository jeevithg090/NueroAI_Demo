import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Catches render errors (including failed lazy-loaded chunks) and offers a reload. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main role="alert" className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display mb-4 text-3xl font-bold">Something went wrong</h1>
        <p className="mb-8 max-w-md text-lg text-pretty text-muted">
          The page failed to load. Reloading usually fixes this.
        </p>
        <button type="button" onClick={() => window.location.reload()} className="btn btn-primary btn-lg">
          Reload page
        </button>
      </main>
    );
  }
}
