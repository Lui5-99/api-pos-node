import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Fix for TypeScript error with captureStackTrace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (
  _err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (_err instanceof AppError) {
    return res.status(_err.statusCode).json({
      status: _err.status,
      message: _err.message,
    });
  }

  // Log error for debugging
  console.error("Error:", _err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};
