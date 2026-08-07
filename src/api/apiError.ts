export type ApiErrorKind = "network" | "rate_limit" | "not_found" | "server" | "unknown";

/**
 * A normalized error shape for every API failure, regardless of source
 * (fetch throwing, a non-2xx response, a timeout). UI code should only
 * ever need to branch on `kind`, never on raw status codes.
 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly retryAfterMs?: number;

  constructor(message: string, kind: ApiErrorKind, status?: number, retryAfterMs?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }

  static fromResponse(response: Response): ApiError {
    if (response.status === 429) {
      const retryAfterHeader = response.headers.get("Retry-After");
      const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : undefined;
      return new ApiError("Rate limit exceeded. Please slow down.", "rate_limit", 429, retryAfterMs);
    }
    if (response.status === 404) {
      return new ApiError("The requested resource was not found.", "not_found", 404);
    }
    if (response.status >= 500) {
      return new ApiError("The upstream market data service is unavailable.", "server", response.status);
    }
    return new ApiError(`Request failed with status ${response.status}.`, "unknown", response.status);
  }

  /** User-facing copy — plain language, no status codes or stack traces. */
  get friendlyMessage(): string {
    switch (this.kind) {
      case "network":
        return "Can't reach the market data service. Check your connection and try again.";
      case "rate_limit":
        return "Too many requests right now. Data will refresh automatically in a moment.";
      case "not_found":
        return "We couldn't find that data.";
      case "server":
        return "The market data service is temporarily unavailable.";
      default:
        return "Something went wrong loading this data.";
    }
  }
}
