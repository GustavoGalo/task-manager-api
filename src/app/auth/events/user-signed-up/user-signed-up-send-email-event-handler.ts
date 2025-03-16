/* eslint-disable prettier/prettier */
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserSignedUpEvent } from "./user-signed-up-event";
import { EmailService } from "src/infra/email/email.service";
import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { ConfigService } from "@nestjs/config";

@EventsHandler(UserSignedUpEvent)
@Processor("email")
export class UserSignedUpSendEmailEventHandler
  implements IEventHandler<UserSignedUpEvent> {
  constructor(
    private readonly emailService: EmailService,
    @InjectQueue("email") private readonly queue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async handle(event: UserSignedUpEvent): Promise<void> {
    await this.queue.add("email", event);
  }

  @Process("email")
  async process(job: Job<UserSignedUpEvent>) {
    const event = job.data;
    const confirmation_link = `${this.configService.getOrThrow("FRONTEND_URL")}/confirm-email/${event.confirmationToken}`;

    await this.emailService.sendSignUpEmail({
      email: event.email,
      confirmation_link,
    });
  }
}
