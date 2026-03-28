export enum ErrorCodes {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
  USER_BLACKLISTED = "USER_BLACKLISTED",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
}

class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    code: string,
    message: string,
    status: number,
    isOperational: boolean,
    details?: any,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.isOperational = isOperational;
    this.details = details || null;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
