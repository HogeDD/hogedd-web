import { beforeEach, describe, expect, it } from "vitest";
import type { Task } from "@/app/apps/clean-tasks/_domain/task";
import {
  TaskNotFoundError,
  TaskService,
  type Clock,
  type IDGenerator,
  type TaskRepository,
} from "@/app/apps/clean-tasks/_usecases/task-service";

class FakeTaskRepository implements TaskRepository {
  tasks: Task[] = [];

  async save(task: Task) {
    this.tasks.push(task);
  }

  async list() {
    return [...this.tasks];
  }

  async complete(id: string) {
    const task = this.tasks.find((candidate) => candidate.id === id);
    if (!task) {
      throw new TaskNotFoundError();
    }

    const completedTask = { ...task, completed: true };
    this.tasks = this.tasks.map((candidate) => (candidate.id === id ? completedTask : candidate));
    return completedTask;
  }
}

describe("TaskService", () => {
  const now = new Date("2026-05-28T12:00:00.000Z");
  let repository: FakeTaskRepository;
  let service: TaskService;

  beforeEach(() => {
    repository = new FakeTaskRepository();

    const idGenerator: IDGenerator = {
      newID: async () => "task-1",
    };
    const clock: Clock = {
      now: () => now,
    };

    service = new TaskService(repository, idGenerator, clock);
  });

  it("creates and saves a task", async () => {
    await expect(service.createTask({ title: "  Write tests  " })).resolves.toEqual({
      id: "task-1",
      title: "Write tests",
      completed: false,
      createdAt: now,
    });
    expect(repository.tasks).toHaveLength(1);
  });

  it("lists tasks in repository order", async () => {
    repository.tasks = [
      { id: "task-1", title: "First", completed: false, createdAt: now },
      {
        id: "task-2",
        title: "Second",
        completed: false,
        createdAt: new Date(now.getTime() + 60_000),
      },
    ];

    await expect(service.listTasks()).resolves.toEqual(repository.tasks);
  });

  it("completes only the requested task", async () => {
    repository.tasks = [
      { id: "task-1", title: "First", completed: false, createdAt: now },
      { id: "task-2", title: "Second", completed: false, createdAt: now },
    ];

    await expect(service.completeTask("task-1")).resolves.toMatchObject({
      id: "task-1",
      completed: true,
    });
    expect(repository.tasks[0].completed).toBe(true);
    expect(repository.tasks[1].completed).toBe(false);
  });

  it("returns not found for an unknown task", async () => {
    await expect(service.completeTask("missing-task")).rejects.toBeInstanceOf(TaskNotFoundError);
  });
});
