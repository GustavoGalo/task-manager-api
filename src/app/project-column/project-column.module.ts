import { Module } from "@nestjs/common";
import { PrismaService } from "src/infra/prisma.service";
import { PrismaProjectColumnRepository } from "src/infra/repositories/prisma-project-column-repository";
import { ProjectColumnService } from "./project-column.service";

@Module({
  providers: [
    PrismaService,
    PrismaProjectColumnRepository,
    ProjectColumnService,
  ],
})
export class ProjectColumnModule {}
