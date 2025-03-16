import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ForgotPasswordEvent } from "./forgot-password-event";
import { Job, Queue } from "bull";
import { EmailService } from "src/infra/email/email.service";
import { ConfigService } from "@nestjs/config";
import { InjectQueue, Process, Processor } from "@nestjs/bull";

@EventsHandler(ForgotPasswordEvent)
@Processor("email")
export class ForgotPasswordSentEmailEventHandler implements IEventHandler<ForgotPasswordEvent> {
  constructor(
    private readonly emailService: EmailService,
    @InjectQueue("email") private readonly queue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async handle(event: ForgotPasswordEvent): Promise<void> {
    await this.queue.add("forgot-password", event);
  }

  @Process("forgot-password")
  async process(job: Job<ForgotPasswordEvent>) {
    const event = job.data;
    const reset_link = `${this.configService.getOrThrow("FRONTEND_URL")}/reset-password/${event.resetToken}`;

    await this.emailService.sendForgotPasswordEmail({ email: event.email, reset_link });
  }
}