import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { PrismaProjectRepository } from "src/infra/repositories/prisma-project-repository";
import { PrismaProjectColumnRepository } from "src/infra/repositories/prisma-project-column-repository";
import { PrismaService } from "src/infra/prisma.service";

@Module({
  controllers: [ProjectController],
  providers: [
    PrismaService,
    ProjectService,
    PrismaProjectRepository,
    PrismaProjectColumnRepository,
  ],
})
export class ProjectModule {}
