import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { UserController } from "./user.controller";
import { PrismaService } from "src/infra/prisma.service";

@Module({
  providers: [UserService, PrismaUserRepository, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
