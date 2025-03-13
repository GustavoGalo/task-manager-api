import { BadRequestException } from "@nestjs/common";
import { EventBus, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SignUpQuery } from "src/app/auth/queries/sign-up/sign-up-query";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { PasswordService } from "../../password.service";
import { generateId } from "src/utils/generate-id";
import { UserSignedUpEvent } from "../../events/user-signed-up/user-signed-up-event";
import { generateRandomCode } from "src/utils/generate-random-code";

@QueryHandler(SignUpQuery)
export class SignUpHandler implements IQueryHandler<SignUpQuery, void> {
  constructor(
    private readonly repository: PrismaUserRepository,
    private readonly passwordService: PasswordService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: SignUpQuery) {
    const { email, password, username, name } = query;
    const existingUser = await this.repository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException(ErrorMessages.AUTH.EMAIL_IN_USE);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const userID = generateId();
    const confirmationCode = generateRandomCode();
    const confirmationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await this.repository.create({
      email,
      password: hashedPassword,
      name,
      id: userID,
      username,
      confirmationCode,
      confirmationCodeExpiresAt,
    });
    await this.eventBus.publish(new UserSignedUpEvent(email, confirmationCode));
  }
}
