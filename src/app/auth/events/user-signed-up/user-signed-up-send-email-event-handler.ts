/* eslint-disable prettier/prettier */
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserSignedUpEvent } from "./user-signed-up-event";
import { EmailService } from "src/infra/email/email.service";
import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";

@EventsHandler(UserSignedUpEvent)
@Processor("email")
export class UserSignedUpSendEmailEventHandler
  implements IEventHandler<UserSignedUpEvent> {
  constructor(private readonly emailService: EmailService, @InjectQueue("email") private readonly queue: Queue) {}

  async handle(event: UserSignedUpEvent): Promise<void> {
    await this.queue.add("email", event);
  }

  @Process("email")
  async process(job: Job<UserSignedUpEvent>) {
    const event = job.data;


    await this.emailService.sendSignUpEmail({
      email: event.email,
      code: event.confirmationCode,
    });
  }
}
