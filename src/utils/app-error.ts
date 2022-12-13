import { STATUS_CODES } from "./status-code.enum";

class AppError extends Error {
  constructor(
    public name: string,
    public statusCode: number,
    public description: string,
    public isOperational: boolean,
    public errorStack?: string,
    public logingErrorResponse?: string
  ) {
    super(description);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.logingErrorResponse = logingErrorResponse;
    Error.captureStackTrace(this);
  }
}

class ApiError extends AppError {
  constructor(
    name: string,
    statusCode = STATUS_CODES.INTERNAL_ERROR,
    description = "Internal Server Error",
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

export default { AppError, ApiError}; 
