import { Task } from "../entities/task-entity";

export interface TaskRepository {
  findMany(projectId: string): Promise<Task[]>;
  create(task: Task): Promise<Task>;
}
