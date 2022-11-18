import { InternalError } from "./InternalError";

export class BadRequestError extends InternalError {
  constructor(
    public message: string,
    public code = 400,
    public description?: string,
    public documentation?: string
  ) {
    super(message, code, description, documentation);
  }
}
