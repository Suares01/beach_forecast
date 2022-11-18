export interface Middleware {
  use(...object: any): void | Promise<void>;
}

export interface ConfigurableMiddleware {
  use(...object: any): (...params: any) => void | Promise<void>;
}
