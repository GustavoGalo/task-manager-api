/* eslint-disable prettier/prettier */
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserSignedUpEvent } from "./user-signed-up-event";
import { EmailService } from "src/infra/email/email.service";

@EventsHandler(UserSignedUpEvent)
export class UserSignedUpSendEmailEventHandler
  implements IEventHandler<UserSignedUpEvent> {
  constructor(private readonly emailService: EmailService) {}

  async handle(event: UserSignedUpEvent): Promise<void> {
    await this.emailService.sendSignUpEmail({
      email: event.email,
      code: event.confirmationCode,
    });
  }
}
