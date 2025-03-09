import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaProjectRepository } from "src/infra/repositories/prisma-project-repository";
import { CreateProjectDto } from "src/domain/project/dto/create-project-dto";
import { generateId } from "src/utils/generate-id";
import { UpdateProjectDto } from "src/domain/project/dto/update-project-dto";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { plainToInstance } from "class-transformer";
import { ProjectResponseDto } from "src/domain/project/dto/project-response-dto";

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: PrismaProjectRepository) {}

  async index(userId: string) {
    const projects = await this.projectRepository.findMany(userId);

    return projects;
  }

  async create(userId: string, project: CreateProjectDto) {
    const { description, name } = project;

    const target = await this.projectRepository.findByName(userId, name);

    if (target) {
      throw new BadGatewayException(ErrorMessages.PROJECT.NAME_ALREADY_EXISTS);
    }

    const projectId = generateId();
    const projectCreated = await this.projectRepository.create({
      description,
      name,
      id: projectId,
      userId,
    });

    return plainToInstance(ProjectResponseDto, projectCreated);
  }

  async update(
    userId: string,
    project: Partial<UpdateProjectDto>,
    projectId: string,
  ) {
    const target = await this.projectRepository.findById(projectId);

    if (!target) {
      throw new NotFoundException(ErrorMessages.PROJECT.NOT_FOUND);
    }

    if (target.userId !== userId) {
      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    const projectUpdated = await this.projectRepository.update(
      projectId,
      project,
    );

    return plainToInstance(ProjectResponseDto, projectUpdated);
  }

  async inactivate(userId: string, projectId: string) {
    const target = await this.projectRepository.findById(projectId);

    if (!target) {
      throw new NotFoundException(ErrorMessages.PROJECT.NOT_FOUND);
    }

    if (target.userId !== userId) {
      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    const projectUpdated = await this.projectRepository.update(projectId, {
      active: false,
    });

    return plainToInstance(ProjectResponseDto, projectUpdated);
  }
}
