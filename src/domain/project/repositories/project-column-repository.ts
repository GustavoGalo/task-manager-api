import { ProjectColumn } from "../entities/project-column";

export interface ProjectColumnRepository {
  findById(id: string): Promise<ProjectColumn | null>;
  create(projectColumn: ProjectColumn): Promise<ProjectColumn>;
}
