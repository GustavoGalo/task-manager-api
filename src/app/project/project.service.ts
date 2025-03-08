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
import { PrismaProjectColumnRepository } from "src/infra/repositories/prisma-project-column-repository";
import { CreateProjectColumnDto } from "src/domain/project/dto/create-project-column-dto";

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: PrismaProjectRepository,
    private readonly projectColumnRepository: PrismaProjectColumnRepository,
  ) {}

  async index(userId: string) {
    const projects = await this.projectRepository.findMany(userId);

    return projects;
  }

  async create(userId: string, project: CreateProjectDto) {
    const { description, name } = project;

    const target = await this.projectRepository.findByName(userId, name);

    if (target) {
      throw new BadGatewayException(
        "You already have a project with this name",
      );
    }

    const projectId = generateId();
    const projectCreated = await this.projectRepository.create({
      description,
      name,
      id: projectId,
      userId,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return projectCreated;
  }

  async update(
    userId: string,
    project: Partial<UpdateProjectDto>,
    projectId: string,
  ) {
    const target = await this.projectRepository.findById(projectId);

    if (!target) {
      throw new NotFoundException("Project not found");
    }

    if (target.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const projectUpdated = await this.projectRepository.update(
      projectId,
      project,
    );

    return projectUpdated;
  }

  async inactivate(userId: string, projectId: string) {
    const target = await this.projectRepository.findById(projectId);

    if (!target) {
      throw new NotFoundException("Project not found");
    }

    if (target.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const projectUpdated = await this.projectRepository.update(projectId, {
      active: false,
    });

    return projectUpdated;
  }

  async createColumn(userId: string, projectColumn: CreateProjectColumnDto) {
    const project = await this.projectRepository.findById(
      projectColumn.projectId,
    );

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const projectColumnId = generateId();
    const column = await this.projectColumnRepository.create({
      id: projectColumnId,
      name: projectColumn.name,
      projectId: project.id,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return column;
  }
}
