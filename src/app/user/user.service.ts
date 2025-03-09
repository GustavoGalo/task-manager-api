import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ProfileResponseDto } from "src/domain/users/dto/profile-response-dto";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: PrismaUserRepository) {}

  async profile(id: string) {
    const profile = await this.userRepository.profile(id);

    return plainToInstance(ProfileResponseDto, profile);
  }
}
