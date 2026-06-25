export abstract class ApplicationError extends Error {
  abstract readonly code: string;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends ApplicationError {
  readonly code = "unauthorized";

  constructor(message = "Unauthorized") {
    super(message);
  }
}

export class ForbiddenError extends ApplicationError {
  readonly code = "forbidden";

  constructor(message = "Forbidden") {
    super(message);
  }
}

export class BadRequestError extends ApplicationError {
  readonly code = "bad_request";

  constructor(message = "Bad request") {
    super(message);
  }
}

export class NotFoundError extends ApplicationError {
  readonly code = "not_found";

  constructor(message = "Not found") {
    super(message);
  }
}
