import { Request as Req, Response as Res, NextFunction } from "express";
import ErrorResponse from "../utils/error-response.utils";
import {
  ConnectionError,
  Sequelize,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";

const errorHandler = (
  err: Error & Sequelize,
  req: Req,
  res: Res,
  next: NextFunction
) => {
  let error: ErrorResponse;

  if (err instanceof ErrorResponse) {
    error = err;
  } else {
    error = new ErrorResponse(
      err?.message || "An unexpected error occurred. Please try again later",
      500
    );
    console.error(err);
  }
  if (err instanceof UniqueConstraintError) {
    error = new ErrorResponse(err.errors[0].message, 400);
  } else if (err instanceof ValidationError) {
    error = new ErrorResponse(err.message, 400);
  } else if (err instanceof ConnectionError) {
    error = new ErrorResponse(
      "Failed to connect to database. Please try again later.",
      500
    );
    console.error(`Database Connection Error:`, err);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

export { errorHandler };
