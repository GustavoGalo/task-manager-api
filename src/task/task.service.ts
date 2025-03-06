import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

import { TaskDto } from "./types";
import { PrismaService } from "src/infra/prisma.service";

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, task: TaskDto) {
    const projectColumn = await this.prisma.projectColumn.findUnique({
      where: { id: task.projectColumnId },
    });

    if (!projectColumn) {
      throw new NotFoundException("Column not found");
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectColumn.projectId },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const createdTask = await this.prisma.task.create({
      data: {
        id: uuidv4(),
        description: task.description,
        title: task.title,
        projectColumnId: projectColumn.id,
      },
    });

    return createdTask;
  }
}
