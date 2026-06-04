import { Request, Response, NextFunction } from "express";

// ── Custom Error Class ───────────────────────────────────────────────
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "AppError";
  }
}

// ── Global Error Handler Middleware ──────────────────────────────────
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[Error] ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
    return;
  }

  // Unexpected errors
  res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
}
