import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PasswordService } from "../../password.service";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignInCommand } from "./sign-in-command";

interface Output {
  token: string;
}

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand, Output> {
  constructor(
    private readonly repository: PrismaUserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: SignInCommand): Promise<Output> {
    const { email, password } = command;
    const existingUser = await this.repository.findByEmail(email);

    if (
      !existingUser ||
      !(await this.passwordService.comparePassword(
        password,
        existingUser.password,
      ))
    ) {
      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    const payload = { username: existingUser.username, sub: existingUser.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
