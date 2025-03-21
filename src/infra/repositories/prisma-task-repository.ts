import { TaskRepository } from "src/domain/tasks/repositories/task-repository";
import { PrismaService } from "../prisma.service";
import { Task } from "src/domain/tasks/entities/task-entity";
import { Injectable } from "@nestjs/common";
import { CreateTask } from "src/domain/tasks/entities/create-task";

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(projectId: string): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: {
        ProjectColumn: {
          Project: {
            id: projectId,
          },
        },
      },
    });
  }

  async create(task: CreateTask): Promise<Task> {
    return await this.prisma.task.create({
      data: task,
    });
  }
}
