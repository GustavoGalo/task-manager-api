import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { generateId } from "src/utils/generate-id";
import { CreateUserDto } from "src/domain/users/dto/create-user-dto";
import { LoginDto } from "src/domain/auth/dto/login-dto";
import { PasswordService } from "./password.service";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "src/domain/users/dto/user-response-dto";
import { EmailService } from "src/infra/email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly repository: PrismaUserRepository,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(body: CreateUserDto) {
    const { email, password, username, name } = body;
    const existingUser = await this.repository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException(ErrorMessages.AUTH.EMAIL_IN_USE);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const userID = generateId();
    const newUser = await this.repository.create({
      email,
      password: hashedPassword,
      name,
      username,
      id: userID,
    });

    await this.emailService.sendSignUpEmail({ code: "12312", email });

    return plainToInstance(UserResponseDto, newUser);
  }

  async signIn(body: LoginDto) {
    const { email, password } = body;
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
