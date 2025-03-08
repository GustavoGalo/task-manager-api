import { Injectable } from "@nestjs/common";

import { UserRepository } from "src/domain/users/repositories/user-repository";
import { PrismaService } from "../prisma.service";
import { User } from "src/domain/users/entities/user-entity";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
