class AppError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
