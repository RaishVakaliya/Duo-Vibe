interface ErrorWithPotentialCode {
  code?: string | number;
  message?: string;
  details?: string;
  hint?: string;
}

export function getErrorMessage(
  error: unknown,
  fallback: string = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;

  if (typeof error === "string") {
    if (error.includes("Network request failed") || error.includes("Failed to fetch")) {
      return "Unable to connect. Please check your internet connection.";
    }
    return error.length > 0 ? error : fallback;
  }

  if (typeof error === "object") {
    const err = error as ErrorWithPotentialCode;

    // Check PostgreSQL / PostgREST error codes
    const code = String(err.code || "");
    if (code === "23505") {
      return "This record already exists.";
    }
    if (code === "42501") {
      return "You do not have permission to perform this action.";
    }
    if (code === "PGRST116") {
      return "The requested item was not found.";
    }

    if (err.message && typeof err.message === "string") {
      const msg = err.message;
      if (
        msg.includes("Network request failed") ||
        msg.includes("Failed to fetch") ||
        msg.includes("network")
      ) {
        return "Unable to connect. Please check your internet connection.";
      }
      if (msg.includes("JWT expired") || msg.includes("invalid claim")) {
        return "Your session has expired. Please sign in again.";
      }
      return msg;
    }
  }

  return fallback;
}
