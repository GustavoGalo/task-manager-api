import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ProjectDto } from "./types";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async index(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId },
    });

    return projects;
  }

  async create(userId: string, project: ProjectDto) {
    const { description, name } = project;
    const projectCreated = await this.prisma.project.create({
      data: { description, name, id: uuidv4(), userId },
    });

    return projectCreated;
  }

  async update(
    userId: string,
    project: Partial<ProjectDto>,
    projectId: string,
  ) {
    const data: Partial<ProjectDto> = {};

    const target = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!target) {
      return new NotFoundException("Project nor found");
    }

    if (target.userId !== userId) {
      return new UnauthorizedException("Invalid credentials");
    }

    if (project.description) {
      data.description = project.description;
    }

    if (project.name) {
      data.name = project.name;
    }

    const projectUpdated = await this.prisma.project.update({
      data,
      where: { id: projectId },
    });

    return projectUpdated;
  }

  async inactivate(userId: string, projectId: string) {
    const target = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!target) {
      return new NotFoundException("Project nor found");
    }

    if (target.userId !== userId) {
      return new UnauthorizedException("Invalid credentials");
    }

    const projectUpdated = await this.prisma.project.update({
      data: { active: false },
      where: { id: projectId },
    });

    return projectUpdated;
  }
}
