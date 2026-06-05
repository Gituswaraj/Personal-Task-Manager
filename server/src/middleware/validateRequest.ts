import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "./errorHandler";

/**
 * Creates a middleware that validates req.body against a Zod schema.
 * On failure, throws an AppError with 400 status and field-level details.
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = (err as any).issues ?? (err as any).errors ?? [];
        const details = issues.map((e: any) => ({
          field: (e.path ?? []).join("."),
          message: e.message,
        }));
        next(new AppError(400, "Validation failed", details));
      } else {
        next(err);
      }
    }
  };
}
