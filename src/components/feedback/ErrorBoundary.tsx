import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional scoped fallback label, e.g. "the chart" — keeps the message contextual. */
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Class component is required here — React has no hook-based equivalent of
 * getDerivedStateFromError/componentDidCatch. Kept generic and reusable so
 * any feature can wrap a risky subtree (e.g. a chart library) without a
 * crash there taking down the whole page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", this.props.label ?? "", error, info.componentStack);
  }

  private reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border-subtle bg-bg-surface px-6 py-12 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-muted">
          <AlertOctagon className="h-6 w-6 text-error" aria-hidden="true" />
        </div>
        <p className="max-w-sm text-caption text-text-secondary">
          {this.props.label ? `${this.props.label} couldn't be displayed.` : "Something went wrong."}
        </p>
        <Button variant="outline" size="sm" onClick={this.reset}>
          Try again
        </Button>
      </div>
    );
  }
}
