type ValidationError = {
    field: string;
    message: string;
  };
  
  export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly status: "fail" | "error";
    public readonly errors?: ValidationError[];
  
    constructor(
      message: string,
      statusCode: number,
      errors?: ValidationError[]
    ) {
      super(message);
  
      this.statusCode = statusCode;
      this.isOperational = true;
      this.status = statusCode >= 500 ? "error" : "fail";
      this.errors = errors;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }