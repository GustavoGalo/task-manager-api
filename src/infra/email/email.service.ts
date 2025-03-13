import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { EmailService as EmailServiceInterface } from "src/domain/integrations/email-service";

@Injectable()
export class EmailService implements EmailServiceInterface {
  constructor(private readonly mailerService: MailerService) {}

  async sendSignUpEmail(data: { email: string; code: string }): Promise<void> {
    const { code, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: "Welcome to our platform!",
      template: "./sign-up",
      context: {
        code,
      },
    });
  }
}
