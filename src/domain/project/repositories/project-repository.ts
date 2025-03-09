import { CreateProject } from "../entities/create-project";
import { Project } from "../entities/project-entity";

export interface ProjectRepository {
  findMany(userId: string): Promise<Project[]>;
  findByName(
    userId: string,
    name: string,
    active?: boolean,
  ): Promise<Project | null>;
  findById(id: string): Promise<Project | null>;
  create(project: CreateProject): Promise<Project>;
  update(id: string, project: Project): Promise<Project>;
}
