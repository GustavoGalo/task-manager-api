import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { PrismaTaskRepository } from "src/infra/repositories/prisma-task-repository";
import { PrismaProjectColumnRepository } from "src/infra/repositories/prisma-project-column-repository";
import { PrismaProjectRepository } from "src/infra/repositories/prisma-project-repository";

@Module({
  providers: [
    TaskService,
    PrismaTaskRepository,
    PrismaProjectRepository,
    PrismaProjectColumnRepository,
  ],
  controllers: [TaskController],
})
export class TaskModule {}
