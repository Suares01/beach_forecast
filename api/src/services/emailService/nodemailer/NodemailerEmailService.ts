import config from "config";
import path from "node:path";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

import { IEmailConfig } from "@config/types/configTypes";

import { IEmailService } from "../IEmailService";

const emailConfig = config.get<IEmailConfig>("App.email");

const transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass,
  },
});

transport.use(
  "compile",
  hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve(__dirname, "..", "views"),
    },
    viewPath: path.resolve(__dirname, "..", "views"),
    extName: ".html",
  })
);

export class NodemailerEmailService implements IEmailService {
  public async send<T = any>(
    to: string,
    subject: string,
    template: string,
    context: T
  ): Promise<void> {
    const options = {
      from: `Beach Forecast <${emailConfig.auth.user}>`,
      to,
      subject,
      template,
      context,
    };

    await transport.sendMail(options);
  }
}
