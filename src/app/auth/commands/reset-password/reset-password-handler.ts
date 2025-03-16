import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResetPasswordCommand } from "./reset-password-command";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { JsonWebTokenError, JwtService } from "@nestjs/jwt";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PasswordService } from "../../password.service";

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(private readonly repository: PrismaUserRepository, private readonly jwtService: JwtService, private readonly passwordService: PasswordService) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    let email: string;
    const { resetToken, password } = command;
    try {
      const decoded = this.jwtService.verify(resetToken);
      email = decoded.email as string;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException(ErrorMessages.AUTH.RESET_PASSWORD_TOKEN_EXPIRED);
      }
      throw new BadRequestException(ErrorMessages.AUTH.INVALID_RESET_PASSWORD_TOKEN);
    }

    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(ErrorMessages.AUTH.USER_NOT_FOUND);
    }

    if (!this.passwordService.validatePasswordStrength(password)) {
      throw new BadRequestException(ErrorMessages.AUTH.PASSWORD_WEAK);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    await this.repository.save({ ...user, password: hashedPassword });
  }
}
