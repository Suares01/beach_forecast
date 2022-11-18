export interface IEmailService {
  send<T = any>(
    to: string,
    subject: string,
    template: string,
    context: T
  ): Promise<void>;
}
