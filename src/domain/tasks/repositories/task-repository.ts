import { Task } from "generated/prisma_client";

export interface TaskRepository {
  findMany(projectId: string): Promise<Task[]>;
  create(task: Task): Promise<Task>;
}
