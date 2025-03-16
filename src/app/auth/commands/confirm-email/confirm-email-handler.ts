/* eslint-disable prettier/prettier */
import { CommandHandler } from "@nestjs/cqrs";
import { ConfirmEmailCommand } from "./confirm-email-command";
import { ICommandHandler } from "@nestjs/cqrs";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { JsonWebTokenError, JwtService } from "@nestjs/jwt";

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailHandler
  implements ICommandHandler<ConfirmEmailCommand> {
  constructor(
    private readonly userRepository: PrismaUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: ConfirmEmailCommand) {
    try {
      const { confirmationToken } = command;
      const { email } = this.jwtService.verify(confirmationToken);
      const user = await this.userRepository.findByEmail(email as string);

      if (!user) {
        throw new NotFoundException(ErrorMessages.AUTH.USER_NOT_FOUND);
      }

      await this.userRepository.save({ ...user, active: true });
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException(ErrorMessages.AUTH.CONFIRMATION_CODE_EXPIRED);
      }
      throw new BadRequestException(ErrorMessages.AUTH.INVALID_CONFIRMATION_TOKEN);
    }
  }
}
