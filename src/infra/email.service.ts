import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EmailService } from "src/domain/integrations/email-service";

@Injectable()
export class NodemailerEmailService implements EmailService {
  private transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private readonly config: ConfigService) {
    this.transporter = createTransport({
      host: config.getOrThrow("EMAIL_HOST"),
      port: config.getOrThrow("EMAIL_PORT"),
      auth: {
        user: config.getOrThrow("EMAIL_USER"),
        pass: config.getOrThrow("EMAIL_PASS"),
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.getOrThrow("EMAIL_FROM"),
      to,
      subject,
      text: body,
    });
  }
}
