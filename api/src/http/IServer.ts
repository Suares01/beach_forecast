export interface IServer {
  start(): void | Promise<void>;
  close(): void | Promise<void>;
}
