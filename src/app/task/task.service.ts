import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { generateId } from "src/utils/generate-id";
import { PrismaProjectColumnRepository } from "src/infra/repositories/prisma-project-column-repository";
import { PrismaTaskRepository } from "src/infra/repositories/prisma-task-repository";
import { CreateTaskDto } from "src/domain/tasks/dto/create-task-dto";
import { PrismaProjectRepository } from "src/infra/repositories/prisma-project-repository";

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: PrismaTaskRepository,
    private readonly projectRepository: PrismaProjectRepository,
    private readonly projectColumnRepository: PrismaProjectColumnRepository,
  ) {}

  async create(userId: string, task: CreateTaskDto) {
    const projectColumn = await this.projectColumnRepository.findById(
      task.projectColumnId,
    );

    if (!projectColumn) {
      throw new NotFoundException("Column not found");
    }

    const project = await this.projectRepository.findById(projectColumn.id);

    if (project?.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const taskId = generateId();
    const createdTask = await this.taskRepository.create({
      id: taskId,
      description: task.description,
      title: task.title,
      projectColumnId: projectColumn.id,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return createdTask;
  }

  async tasks(userId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tasks = await this.taskRepository.findMany(projectId);

    return tasks;
  }
}
