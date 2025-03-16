import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ForgotPasswordCommand } from "./forgot-password-command";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ForgotPasswordEvent } from "../../events/forgot-password/forgot-password-event";

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand, void> {
  constructor(
    private readonly repository: PrismaUserRepository,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    const { email } = command;
    const existingUser = await this.repository.findByEmail(email);

    if (!existingUser) {
      throw new NotFoundException(ErrorMessages.AUTH.USER_NOT_FOUND);
    }

    const resetToken = this.jwtService.sign({ email });

    await this.eventBus.publish(new ForgotPasswordEvent(email, resetToken));
  }
}