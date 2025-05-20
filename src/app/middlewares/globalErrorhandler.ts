/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";
import { TErrorSources } from "../interfaces/error";
import config from "../../config";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Default error response
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  // Handle specific errors
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode || statusCode;
    message = simplifiedError.message || message;
    errorSources = simplifiedError.errorSources || errorSources;
  } else if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode || statusCode;
    message = simplifiedError.message || message;
    errorSources = simplifiedError.errorSources || errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  // Send the response
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.node_env === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
