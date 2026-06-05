import { MemoryTaskRepository } from "@/app/apps/clean-tasks/_infrastructure/memory-task-repository";
import { SequentialIDGenerator, SystemClock } from "@/app/apps/clean-tasks/_infrastructure/system";
import { TaskService } from "@/app/apps/clean-tasks/_usecases/task-service";

const repository = new MemoryTaskRepository();

export const taskService = new TaskService(
  repository,
  new SequentialIDGenerator("task"),
  new SystemClock(),
);
