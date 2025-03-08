import { ProjectRepository } from "src/domain/project/repositories/project-repository";
import { PrismaService } from "../prisma.service";
import { Project } from "src/domain/project/entities/project-entity";

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(project: Project): Promise<Project> {
    return await this.prisma.project.create({
      data: project,
    });
  }

  async findByName(
    userId: string,
    name: string,
    active = true,
  ): Promise<Project | null> {
    return await this.prisma.project.findFirst({
      where: { name, userId, active },
    });
  }

  async findById(id: string): Promise<Project | null> {
    return await this.prisma.project.findUnique({
      where: { id },
    });
  }

  async findMany(userId: string): Promise<Project[]> {
    return await this.prisma.project.findMany({
      where: { userId, active: true },
    });
  }

  async update(id: string, project: Partial<Project>): Promise<Project> {
    return await this.prisma.project.update({
      data: project,
      where: { id },
    });
  }
}
