import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SignInQuery } from "./sign-in-query";
import { PasswordService } from "../../password.service";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

interface Output {
  token: string;
}

@QueryHandler(SignInQuery)
export class SignInHandler implements IQueryHandler<SignInQuery, Output> {
  constructor(
    private readonly repository: PrismaUserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(query: SignInQuery): Promise<Output> {
    const { email, password } = query;
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
