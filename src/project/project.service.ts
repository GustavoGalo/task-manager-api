import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ProjectColumnDto, ProjectDto } from "./types";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async index(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId, active: true },
    });

    return projects;
  }

  async create(userId: string, project: ProjectDto) {
    const { description, name } = project;

    const target = await this.prisma.project.findFirst({
      where: { name, userId, active: true },
    });

    if (target) {
      throw new BadGatewayException(
        "You already have a project with this name",
      );
    }

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
      throw new NotFoundException("Project not found");
    }

    if (target.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
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
      throw new NotFoundException("Project not found");
    }

    if (target.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const projectUpdated = await this.prisma.project.update({
      data: { active: false },
      where: { id: projectId },
    });

    return projectUpdated;
  }

  async createColumn(userId: string, projectColumn: ProjectColumnDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectColumn.projectId },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const column = await this.prisma.projectColumn.create({
      data: { id: uuidv4(), name: projectColumn.name, projectId: project.id },
    });

    return column;
  }

  async tasks(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tasks = await this.prisma.project.findMany({
      include: { column: { include: { tasks: true } } },
    });

    return tasks;
  }
}
