import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { PrismaProjectRepository } from "src/infra/repositories/prisma-project-repository";
import { PrismaProjectColumnRepository } from "src/infra/repositories/prisma-project-column-repository";

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService,
    PrismaProjectRepository,
    PrismaProjectColumnRepository,
  ],
})
export class ProjectModule {}
