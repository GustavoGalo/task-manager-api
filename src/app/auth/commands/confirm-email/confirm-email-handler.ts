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
    const { confirmationToken } = command;
    let email: string;

    try {
      const decoded = this.jwtService.verify(confirmationToken);
      email = decoded.email as string;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException(ErrorMessages.AUTH.CONFIRMATION_CODE_EXPIRED);
      }
      throw new BadRequestException(ErrorMessages.AUTH.INVALID_CONFIRMATION_TOKEN);
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(ErrorMessages.AUTH.USER_NOT_FOUND);
    }

    await this.userRepository.save({ ...user, active: true });
  }
}
