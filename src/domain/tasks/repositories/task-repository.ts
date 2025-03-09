import { CreateTask } from "../entities/create-task";
import { Task } from "../entities/task-entity";

export interface TaskRepository {
  findMany(projectId: string): Promise<Task[]>;
  create(task: CreateTask): Promise<Task>;
}
