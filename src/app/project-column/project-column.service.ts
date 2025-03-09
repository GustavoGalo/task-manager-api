import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { CreateProjectColumnDto } from "src/domain/project/dto/create-project-column-dto";
import { PrismaProjectColumnRepository } from "src/infra/repositories/prisma-project-column-repository";
import { PrismaProjectRepository } from "src/infra/repositories/prisma-project-repository";
import { generateId } from "src/utils/generate-id";

@Injectable()
export class ProjectColumnService {
  constructor(
    private readonly projectColumnRepository: PrismaProjectColumnRepository,
    private readonly projectRepository: PrismaProjectRepository,
  ) {}

  async create(userId: string, projectColumn: CreateProjectColumnDto) {
    const project = await this.projectRepository.findById(
      projectColumn.projectId,
    );

    if (!project) {
      throw new NotFoundException(ErrorMessages.PROJECT.NOT_FOUND);
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    const projectColumnId = generateId();
    const column = await this.projectColumnRepository.create({
      id: projectColumnId,
      name: projectColumn.name,
      projectId: project.id,
    });

    return plainToInstance(CreateProjectColumnDto, column);
  }
}
