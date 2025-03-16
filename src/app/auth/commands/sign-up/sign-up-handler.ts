import { BadRequestException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { PasswordService } from "../../password.service";
import { generateId } from "src/utils/generate-id";
import { UserSignedUpEvent } from "../../events/user-signed-up/user-signed-up-event";
import { SignUpCommand } from "./sign-up-command";
import { JwtService } from "@nestjs/jwt";

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand, void> {
  constructor(
    private readonly repository: PrismaUserRepository,
    private readonly passwordService: PasswordService,
    private readonly eventBus: EventBus,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: SignUpCommand) {
    const { email, password, username, name } = command;
    const existingUser = await this.repository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException(ErrorMessages.AUTH.EMAIL_IN_USE);
    }

    if (!this.passwordService.validatePasswordStrength(password)) {
      throw new BadRequestException(ErrorMessages.AUTH.PASSWORD_WEAK);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const userID = generateId();
    const confirmationToken = this.jwtService.sign({ email });
    await this.repository.create({
      email,
      password: hashedPassword,
      name,
      id: userID,
      username,
    });
    await this.eventBus.publish(
      new UserSignedUpEvent(email, confirmationToken),
    );
  }
}
