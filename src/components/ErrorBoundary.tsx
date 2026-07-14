"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackLabel: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error boundaries must be class components — hooks have no equivalent of
// getDerivedStateFromError/componentDidCatch for catching render errors.
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `ErrorBoundary caught an error in "${this.props.fallbackLabel}":`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex flex-col gap-1 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40"
        >
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {this.props.fallbackLabel} failed to render.
          </p>
          <p className="text-xs text-red-600 dark:text-red-400">
            The rest of the dashboard is unaffected. Try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
