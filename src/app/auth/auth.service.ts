import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { PrismaService } from "src/infra/prisma.service";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { generateId } from "src/utils/generate-id";
import { CreateUserDto } from "src/domain/users/dto/create-user-dto";
import { LoginDto } from "src/domain/auth/dto/login-dto";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly repository: PrismaUserRepository,
  ) {}

  async signUp(body: CreateUserDto) {
    const { email, password, username, name } = body;
    const existingUser = await this.repository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException("Email in use");
    }

    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const saltAndHash = `${salt}.${hash.toString("hex")}`;

    const userID = generateId();
    const newUser = await this.repository.create({
      email,
      password: saltAndHash,
      name,
      username,
      id: userID,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      email: newUser.email,
      name: newUser.name,
      username: newUser.username,
    };
  }

  async signIn(body: LoginDto) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const [salt, storedHash] = user.password.split(".");
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash != hash.toString("hex")) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { username: user.username, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
