import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "src/infra/prisma.service";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { PasswordService } from "./password.service";
import { EmailService } from "src/infra/email/email.service";
import { CqrsModule } from "@nestjs/cqrs";
import { EventHandlers } from "./events";
import { BullModule } from "@nestjs/bull";
import { CommandHandlers } from "./commands";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "email",
    }),
    CqrsModule,
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
    PasswordService,
    PrismaService,
    JwtStrategy,
    PrismaUserRepository,
    EmailService,
    ...EventHandlers,
    ...CommandHandlers,
  ],
  exports: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
