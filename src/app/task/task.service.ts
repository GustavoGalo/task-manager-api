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
import { ErrorMessages } from "src/domain/errors/error-messages";
import { plainToInstance } from "class-transformer";
import { ResponseTaskDto } from "src/domain/tasks/dto/task-response-dto";

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
      throw new NotFoundException(ErrorMessages.TASK.COLUMN_NOT_FOUND);
    }

    const project = await this.projectRepository.findById(projectColumn.id);

    if (project?.userId !== userId) {
      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    const taskId = generateId();
    const createdTask = await this.taskRepository.create({
      id: taskId,
      description: task.description,
      title: task.title,
      projectColumnId: projectColumn.id,
    });

    return plainToInstance(ResponseTaskDto, createdTask);
  }

  async tasks(userId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException(ErrorMessages.TASK.PROJECT_NOT_FOUND);
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    const tasks = await this.taskRepository.findMany(projectId);

    return tasks;
  }
}
