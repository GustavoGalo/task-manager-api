import { Injectable } from "@nestjs/common";
import { EmailService as EmailServiceInterface } from "src/domain/integrations/email-service";
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from "@nestjs/config";
import { renderFile } from "ejs";
import { join } from "path";

@Injectable()
export class EmailService implements EmailServiceInterface {

  constructor(
    private readonly config: ConfigService
  ) {
    SendGrid.setApiKey(this.config.getOrThrow("SANDGRID_API_KEY"));
  }

  async sendSignUpEmail(data: {
    email: string;
    confirmation_link: string;
  }): Promise<void> {
    const { confirmation_link, email } = data;
    let html;

    try {
      html = await renderFile(join(__dirname, "/templates/sign-up.ejs"), { confirmation_link });
    } catch (error) {
      console.error("Error rendering sign-up template: ", error);
      throw new Error("Error rendering sign-up template");
    }

    await SendGrid.send({
      to: email,
      subject: "Welcome to our platform!",
      from: "gg.gustavo.galo@gmail.com",
      html
    })

  }

  async sendForgotPasswordEmail(data: {
    email: string;
    reset_link: string;
  }): Promise<void> {
    const { reset_link, email } = data;
    let html;

    try {
      html = await renderFile(join(__dirname, "/templates/forgot-password.ejs"), { reset_link });
    } catch (error) {
      console.error("Error rendering sign-up template: ", error);
      throw new Error("Error rendering sign-up template");
    }

    await SendGrid.send({
      to: email,
      subject: "Reset Password",
      from: "gg.gustavo.galo@gmail.com",
      html
    })

  }
}
