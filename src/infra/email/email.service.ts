import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { EmailService as EmailServiceInterface } from "src/domain/integrations/email-service";

@Injectable()
export class EmailService implements EmailServiceInterface {
  constructor(private readonly mailerService: MailerService) {}

  async sendSignUpEmail(data: {
    email: string;
    confirmation_link: string;
  }): Promise<void> {
    const { confirmation_link, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: "Welcome to our platform!",
      template: "./sign-up",
      context: {
        confirmation_link,
      },
    });
  }

  async sendForgotPasswordEmail(data: {
    email: string;
    reset_link: string;
  }): Promise<void> {
    const { reset_link, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: "Reset Password",
      template: "./forgot-password",
      context: {
        reset_link,
      },
    });
  }
}
