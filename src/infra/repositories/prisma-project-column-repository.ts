import { ProjectColumnRepository } from "src/domain/project/repositories/project-column-repository";
import { PrismaService } from "../prisma.service";
import { ProjectColumn } from "src/domain/project/entities/project-column";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaProjectColumnRepository implements ProjectColumnRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectColumn: ProjectColumn): Promise<ProjectColumn> {
    return await this.prisma.projectColumn.create({
      data: {
        id: projectColumn.id,
        name: projectColumn.name,
        active: projectColumn.active,
        createdAt: projectColumn.createdAt,
        updatedAt: projectColumn.updatedAt,
        projectId: projectColumn.projectId,
      },
    });
  }

  async findById(id: string): Promise<ProjectColumn | null> {
    const response = await this.prisma.projectColumn.findUnique({
      where: { id },
      include: { Project: { include: { User: true } } },
    });

    return response;
  }
}
