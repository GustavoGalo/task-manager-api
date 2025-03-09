import { CreateProjectColumn } from "../entities/create-project-column";
import { ProjectColumn } from "../entities/project-column";

export interface ProjectColumnRepository {
  findById(id: string): Promise<ProjectColumn | null>;
  create(projectColumn: CreateProjectColumn): Promise<ProjectColumn>;
}
