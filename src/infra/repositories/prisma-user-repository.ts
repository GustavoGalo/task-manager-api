import { Injectable } from "@nestjs/common";

import { UserRepository } from "src/domain/users/repositories/user-repository";
import { PrismaService } from "../prisma.service";
import { User } from "src/domain/users/entities/user-entity";
import { CreateUser } from "src/domain/users/entities/create-user-entity";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUser): Promise<User> {
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

  async profile(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        projects: true,
      },
    });
  }
}
