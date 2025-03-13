import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "src/infra/prisma.service";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { PasswordService } from "./password.service";
import { EmailService } from "src/infra/email/email.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  providers: [
    AuthService,
    PasswordService,
    PrismaService,
    JwtStrategy,
    PrismaUserRepository,
    EmailService,
  ],
  exports: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
