import { createTask, type Task } from "@/app/apps/clean-tasks/_domain/task";

export interface TaskRepository {
  save(task: Task): Promise<void>;
  list(): Promise<readonly Task[]>;
  complete(id: string): Promise<Task>;
}

export interface IDGenerator {
  newID(): Promise<string>;
}

export interface Clock {
  now(): Date;
}

export type CreateTaskInput = {
  title: string;
};

export class TaskNotFoundError extends Error {
  constructor() {
    super("task not found");
    this.name = "TaskNotFoundError";
  }
}

export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly idGenerator: IDGenerator,
    private readonly clock: Clock,
  ) {}

  async createTask(input: CreateTaskInput): Promise<Task> {
    const task = createTask({
      id: await this.idGenerator.newID(),
      title: input.title,
      createdAt: this.clock.now(),
    });

    await this.repository.save(task);
    return task;
  }

  async listTasks(): Promise<readonly Task[]> {
    return this.repository.list();
  }

  async completeTask(id: string): Promise<Task> {
    return this.repository.complete(id);
  }
}
