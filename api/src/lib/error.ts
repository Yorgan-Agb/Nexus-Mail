export class HtppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends HtppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends HtppError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends HtppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class BadRequestError extends HtppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ConflictError extends HtppError {
  constructor(message: string) {
    super(message, 409);
  }
}
