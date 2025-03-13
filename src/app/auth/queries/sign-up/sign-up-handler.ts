import { BadRequestException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SignUpQuery } from "src/app/auth/queries/sign-up/sign-up-query";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { PasswordService } from "../../password.service";
import { generateId } from "src/utils/generate-id";

@QueryHandler(SignUpQuery)
export class SignUpHandler implements IQueryHandler<SignUpQuery, void> {
  constructor(
    private readonly repository: PrismaUserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(query: SignUpQuery) {
    const { email, password, username, name } = query;
    const existingUser = await this.repository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException(ErrorMessages.AUTH.EMAIL_IN_USE);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const userID = generateId();
    await this.repository.create({
      email,
      password: hashedPassword,
      name,
      id: userID,
      username,
    });
  }
}
