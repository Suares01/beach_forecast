import { InternalError } from "./InternalError";

export class ConflictError extends InternalError {
  constructor(
    public message: string,
    public code = 409,
    public description?: string,
    public documentation?: string
  ) {
    super(message, code, description, documentation);
  }
}
