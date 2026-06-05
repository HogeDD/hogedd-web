import type { Task } from "@/app/apps/clean-tasks/_domain/task";
import {
  TaskNotFoundError,
  type TaskRepository,
} from "@/app/apps/clean-tasks/_usecases/task-service";

export class MemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  async save(task: Task): Promise<void> {
    this.tasks.push(task);
  }

  async list(): Promise<readonly Task[]> {
    return [...this.tasks];
  }

  async complete(id: string): Promise<Task> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new TaskNotFoundError();
    }

    const completedTask = {
      ...this.tasks[taskIndex],
      completed: true,
    };
    this.tasks[taskIndex] = completedTask;
    return completedTask;
  }
}
