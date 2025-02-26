import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { v4 as uuidv4 } from "uuid";

import { TaskDto } from "./types";

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, task: TaskDto) {
    const projectColumn = await this.prisma.projectColumn.findUnique({
      where: { id: task.projectColumnId },
    });

    if (!projectColumn) {
      return new NotFoundException("Column not found");
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectColumn.projectId },
    });

    if (!project) {
      return new NotFoundException("Project not found");
    }

    if (project.userId !== userId) {
      return new UnauthorizedException("Invalid credentials");
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
